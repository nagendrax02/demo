import {
  getFilteredOptions,
  getFilteredOptionsGroup,
  getDropdownOptions
} from '../dropdown-options';
import * as restClient from 'common/utils/rest-client';
import { IUserData, IUserOption, IUserOptionGroup } from 'common/types';

const mockData: IUserData = {
  Options: [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' }
  ],
  OptionSet: [
    { label: 'Group 1', options: [{ label: 'Option 1', value: '1' }] },
    { label: 'Group 2', options: [{ label: 'Option 2', value: '2' }] },
    { label: 'Group 3', options: [{ label: 'Option 3', value: '3' }] }
  ]
};

describe('getFilteredOptions', () => {
  it('should return filtered options based on search text', () => {
    const options: IUserOption[] = mockData.Options;
    const searchText = '1';
    const count = 2;
    const result = getFilteredOptions(options, searchText, count);
    expect(result).toEqual([{ label: 'Option 1', value: '1' }]);
  });
});

describe('getFilteredOptionsGroup', () => {
  it('should return filtered option groups based on search text', () => {
    const options: IUserOptionGroup[] = mockData.OptionSet;
    const searchText = '1';
    const count = 2;
    const result = getFilteredOptionsGroup(options, searchText, count);
    expect(result).toEqual([{ label: 'Group 1', options: [{ label: 'Option 1', value: '1' }] }]);
  });
});

describe('getDropdownOptions', () => {
  it('should return dropdown options', async () => {
    const searchText = '1';
    const additionalData = { key: 'value' };
    const count = 5;
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockData);
    const result = await getDropdownOptions({
      searchText: searchText,
      additionalData: additionalData,
      count: count,
      callerSource: restClient.CallerSource.NA
    });
    expect(result).toEqual([{ label: 'Group 1', options: [{ label: 'Option 1', value: '1' }] }]);
  });
});
