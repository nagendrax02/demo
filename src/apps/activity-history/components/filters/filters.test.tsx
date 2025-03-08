import { render, fireEvent } from '@testing-library/react';
import Filters from './Filters';
import { EntityType } from 'common/types';

const mockStoreData = {
  typeFilter: ['123'],
  setDateFilter: jest.fn(),
  clearFilters: jest.fn()
};

const entityIds = {
  lead: '',
  account: '',
  opportunity: '',
  activity: '',
  task: '',
  [EntityType.AccountActivity]: '',
  [EntityType.Lists]: '',
  [EntityType.Ticket]: ''
};

jest.mock('../../activity-history.store', () => ({
  __esModule: true,
  default: jest.fn(() => mockStoreData)
}));

jest.mock('common/utils/rest-client', () => ({
  __esModule: true,
  httpGet: jest.fn(),
  Module: { Marvin: 'Marvin' },
  CallerSource: {}
}));

describe('Filters Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render Filters component correctly', () => {
    const { getByTestId } = render(<Filters type={EntityType.Lead} entityIds={entityIds} />);
    expect(getByTestId('ah-type-filter')).toBeInTheDocument();
  });

  it('Should clears filters when "Clear Filters" is clicked', () => {
    jest.spyOn(require('../../activity-history.store'), 'default').mockReturnValue(mockStoreData);

    const { getByTestId } = render(<Filters type={EntityType.Lead} entityIds={entityIds} />);

    // fireEvent.click(getByTestId('clear-filters'));
    fireEvent.click(getByTestId('ah-clear-filters-enabled'));

    expect(mockStoreData.clearFilters).toHaveBeenCalled();
  });

  it('Should display "Clear Filters" button as disabled when no filters are applied', () => {
    mockStoreData.typeFilter = [];
    jest.spyOn(require('../../activity-history.store'), 'default').mockReturnValue(mockStoreData);

    const { getByTestId } = render(<Filters type={EntityType.Lead} entityIds={entityIds} />);

    expect(getByTestId('ah-clear-filters-disabled')).not.toHaveClass('enable_clear_filter');
  });

  it('Should display "Clear Filters" button as enabled when filters are applied', () => {
    mockStoreData.typeFilter = ['123'];
    jest.spyOn(require('../../activity-history.store'), 'default').mockReturnValue(mockStoreData);

    const { getByTestId } = render(<Filters type={EntityType.Lead} entityIds={entityIds} />);

    expect(getByTestId('ah-clear-filters-enabled')).toHaveClass('enable_clear_filter');
  });
});
