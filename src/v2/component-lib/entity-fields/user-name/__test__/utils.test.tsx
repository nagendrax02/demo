import * as restClient from 'common/utils/rest-client';
import * as StorageManager from 'common/utils/storage-manager';
import { getUserNames } from '../utils';
import { API_ROUTES } from 'common/constants';
const { Module } = restClient;

jest.mock('common/utils/rest-client', () => ({
  httpGet: jest.fn(),
  httpPost: jest.fn(),
  httpRequest: jest.fn(),
  Module: {
    Marvin: 'MARVIN'
  },
  CallerSource: {}
}));

jest.mock('common/utils/storage-manager', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  StorageKey: {
    UserName: 'user-name'
  }
}));

describe('getUserName', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('Should fetch user names from storage if available', async () => {
    // Arrange
    const ids = ['1', '2'];
    const mockedUserNamesFromStorage = { '1': 'John', '2': 'Jane' };

    jest.spyOn(StorageManager, 'getItem').mockReturnValueOnce(mockedUserNamesFromStorage);

    // Act
    const result = await getUserNames(ids, restClient.CallerSource.NA);

    // Assert
    expect(result).toEqual({ ...mockedUserNamesFromStorage });
    expect(StorageManager.getItem).toHaveBeenCalledWith(StorageManager.StorageKey.UserName);
    expect(restClient.httpPost).toHaveBeenCalledTimes(0);
    expect(StorageManager.setItem).toHaveBeenCalledTimes(0);
  });

  it('Should fetch user names from storage and API when all ids not available in storage', async () => {
    // Arrange
    const ids = ['1', '2', '3'];
    const mockedUserNamesFromStorage = { '1': 'John', '2': 'Jane' };
    const mockedApiResult = { '3': 'Bob' };

    jest.spyOn(StorageManager, 'getItem').mockReturnValueOnce(mockedUserNamesFromStorage);

    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(mockedApiResult);

    // Act
    const result = await getUserNames(ids, restClient.CallerSource.NA);

    // Assert
    expect(result).toEqual({ ...mockedUserNamesFromStorage, ...mockedApiResult });
    expect(StorageManager.getItem).toHaveBeenCalledWith(StorageManager.StorageKey.UserName);
    expect(restClient.httpPost).toHaveBeenCalledWith({
      path: API_ROUTES.userName,
      module: Module.Marvin,
      body: ['3']
    });
    expect(StorageManager.setItem).toHaveBeenCalledWith(StorageManager.StorageKey.UserName, {
      '3': 'Bob'
    });
  });

  it('Should handle null API response and return cached user names', async () => {
    // Arrange
    const ids = ['1', '2', '3'];
    const mockedUserNamesFromStorage = { '1': 'John', '2': 'Jane' };

    jest.spyOn(StorageManager, 'getItem').mockReturnValueOnce(mockedUserNamesFromStorage);

    jest.spyOn(restClient, 'httpPost').mockResolvedValueOnce(null);

    // Act
    const result = await getUserNames(ids, restClient.CallerSource.NA);

    // Assert
    expect(result).toEqual(mockedUserNamesFromStorage);
    expect(StorageManager.getItem).toHaveBeenCalledWith(StorageManager.StorageKey.UserName);
    expect(restClient.httpPost).toHaveBeenCalledWith({
      path: API_ROUTES.userName,
      module: Module.Marvin,
      body: ['3']
    });
    expect(StorageManager.setItem).toHaveBeenCalledTimes(0);
  });
});
