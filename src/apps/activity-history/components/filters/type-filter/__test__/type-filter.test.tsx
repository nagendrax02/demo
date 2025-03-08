import { render, screen, act } from '@testing-library/react';
import TypeFilter from '../TypeFilter';
import { EntityType } from 'common/types';

// Arrange
jest.mock('common/utils/rest-client', () => ({
  __esModule: true,
  httpGet: jest.fn(),
  Module: { Marvin: 'Marvin' },
  CallerSource: {}
}));

const mockSetTypeFilter = jest.fn();
const mockStoreData = {
  typeFilter: ['123'],
  setTypeFilter: mockSetTypeFilter
};

jest.mock('../../../../activity-history.store', () => ({
  __esModule: true,
  default: jest.fn(() => mockStoreData)
}));

jest.mock('../../../../utils', () => ({
  fetchCategoryMetadata: jest.fn(() => Promise.resolve([]))
}));

describe('TypeFilter', () => {
  it('Should render TypeFilter component with default props', async () => {
    // Act
    await act(async () => {
      render(<TypeFilter type={EntityType.Lead} />);
    });

    // Assert
    expect(screen.getByText('All Activities')).toBeInTheDocument();
  });
});
