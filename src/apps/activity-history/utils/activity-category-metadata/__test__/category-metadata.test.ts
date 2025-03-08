import { API_ROUTES } from 'common/constants';
import { Module } from 'common/utils/rest-client';
import { IActivityCategoryMetadata } from '../../../types';
import { fetchCategoryMetadata } from '../category-metadata';

jest.mock('common/utils/rest-client', () => ({
  __esModule: true,
  httpGet: jest.fn(),
  Module: { Marvin: 'Marvin' },
  CallerSource: {}
}));

jest.mock('../cache-category-metadata', () => ({
  __esModule: true,
  getCategoryMetadataCache: jest.fn(),
  setCategoryMetadataCache: jest.fn()
}));

describe('fetchCategoryMetadata', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockData = [
    {
      Text: 'Text1',
      Value: 'Value1',
      EventType: 1,
      Category: 'Category1',
      Selected: false,
      CategoryOrder: 0
    },
    {
      Text: 'Text2',
      Value: 'Value2',
      EventType: 2,
      Category: 'Category2',
      Selected: true,
      CategoryOrder: 1
    }
  ];

  // it('Should fetch category metadata from the server and cache it', async () => {
  //   // Arrange
  //   const serverResponse: IActivityCategoryMetadata[] = mockData;
  //   jest
  //     .spyOn(require('common/utils/rest-client'), 'httpGet')
  //     .mockResolvedValueOnce(serverResponse);

  //   jest
  //     .spyOn(require('../cache-category-metadata'), 'getCategoryMetadataCache')
  //     .mockReturnValueOnce(null);

  //   // Act
  //   const result = await fetchCategoryMetadata();

  //   // Assert
  //   expect(require('common/utils/rest-client').httpGet).toHaveBeenCalledWith({
  //     path: API_ROUTES.activityCategoryMetadata,
  //     module: Module.Marvin
  //   });

  //   expect(require('../cache-category-metadata').setCategoryMetadataCache).toHaveBeenCalledWith(
  //     serverResponse
  //   );

  //   expect(result).toEqual(serverResponse);
  // });

  it('Should return cached category metadata if available from cache', async () => {
    // Arrange
    const cachedMetadata: IActivityCategoryMetadata[] = mockData;

    jest
      .spyOn(require('../cache-category-metadata'), 'getCategoryMetadataCache')
      .mockReturnValueOnce(cachedMetadata);

    // Act
    const result = await fetchCategoryMetadata();

    // Assert
    expect(require('common/utils/rest-client').httpGet).not.toHaveBeenCalled();

    expect(result).toEqual(cachedMetadata);
  });

  it('Should throw an error if fetching category metadata fails', async () => {
    // Arrange
    const error = new Error('Failed to fetch category metadata');
    jest.spyOn(require('common/utils/rest-client'), 'httpGet').mockRejectedValueOnce(error);

    jest
      .spyOn(require('../cache-category-metadata'), 'getCategoryMetadataCache')
      .mockReturnValueOnce(null);

    // Act and Assert
    await expect(fetchCategoryMetadata()).rejects.toThrow(error);

    expect(require('../cache-category-metadata').setCategoryMetadataCache).not.toHaveBeenCalled();
  });
});
