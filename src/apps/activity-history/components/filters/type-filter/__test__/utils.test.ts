import { fetchOptions } from '../utils';

jest.mock('common/utils/rest-client', () => ({
  __esModule: true,
  httpGet: jest.fn(),
  Module: { Marvin: 'Marvin' },
  CallerSource: {}
}));

jest.mock('../../../../utils', () => ({
  fetchCategoryMetadata: jest.fn(() =>
    Promise.resolve([
      { Category: 'Category1', Value: 'Value1', Text: 'Text1' },
      { Category: 'Category1', Value: 'Value2', Text: 'Text2' },
      { Category: 'Category2', Value: 'Value3', Text: 'Text3' }
    ])
  )
}));

describe('fetchOptions function', () => {
  it('Should return all options when searchedText is undefined', async () => {
    // Act
    const options = await fetchOptions({});

    // Assert
    expect(options).toHaveLength(2);
  });

  it('Should filter options by category label when searchedText matches', async () => {
    // Act
    const options = await fetchOptions({ searchText: 'Category1' });

    // Assert
    expect(options).toHaveLength(1);
    expect(options[0].label).toBe('Category1');
  });

  it('Should filter options by subOptions label when searchedText matches', async () => {
    // Act
    const options = await fetchOptions({ searchText: 'Text2' });

    // Assert
    expect(options).toHaveLength(1);
    expect(options![0].subOptions).toHaveLength(1);
    expect(options![0].subOptions![0].label).toBe('Text2');
  });

  it('Should handle case-insensitive search', async () => {
    // Act
    const options = await fetchOptions({ searchText: 'text1' });

    // Assert
    expect(options).toHaveLength(1);
    expect(options![0].subOptions![0].label).toBe('Text1');
  });
});
