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
      value: 'abc',
      label: 'abc'
    }
  ],
  OptionSet: null
};

describe('fetchOption', () => {
  test('Should return the response when default props provided', async () => {
    //Arrange
    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);

    const result = await fetchOption();

    //Assert
    expect(result).toEqual(mockedApiResult.Options);

    expect(restClient.httpPost).toHaveBeenCalledWith({
      path: API_ROUTES.user,
      module: restClient.Module.Marvin,
      body: {
        SearchText: '',
        Count: 100000
      }
    });
  });
});
