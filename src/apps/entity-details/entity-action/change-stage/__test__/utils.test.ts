import * as restClient from 'common/utils/rest-client';
import { fetchOption } from '../utils';
import { API_ROUTES } from 'common/constants';

jest.mock('src/common/utils/rest-client', () => ({
  Module: {
    Marvin: 'MARVIN'
  },
  httpPost: jest.fn(() => Promise.resolve({})),
  CallerSource: {}
}));

const mockedApiResult = {
  SchemaName: null,
  Options: [
    {
      value: 'Prospect',
      label: 'Prospect',
      text: null,
      category: null,
      isDefault: false
    },
    {
      value: 'Opportunity',
      label: 'Opportunity',
      text: null,
      category: null,
      isDefault: false
    }
  ],
  OptionSet: null
};

describe('fetchOption', () => {
  test('Should return the response when default props provided', async () => {
    //Arrange

    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);

    const result = await fetchOption();

    expect(result).toEqual(mockedApiResult.Options);

    expect(restClient.httpPost).toHaveBeenCalledWith({
      path: API_ROUTES.leadDropdownOption,
      module: restClient.Module.Marvin,
      body: {
        SchemaName: 'ProspectStage',
        SearchText: undefined,
        Count: 50
      },
      callerSource: undefined
    });
  });
});
