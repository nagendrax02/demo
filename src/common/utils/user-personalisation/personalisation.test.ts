import { getItem } from '../storage-manager';
import { getUserPersonalisation, setUserPersonalisation } from './user-personalisation';
import { CallerSource, httpGet, httpPost } from '../rest-client';
import { safeParseJson } from '../helpers/helpers';
import { convertToStorableData } from '../storage-manager/storage';

jest.mock('../storage-manager', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  StorageKey: {
    UserPersonalisationKey: 'UserPersonalisationKey'
  }
}));

jest.mock('../storage-manager/storage', () => ({
  convertToStorableData: jest.fn()
}));

jest.mock('../rest-client', () => ({
  httpGet: jest.fn(),
  httpPost: jest.fn(),
  Module: {
    Marvin: 'Marvin'
  }
}));

jest.mock('../helpers/helpers', () => ({
  safeParseJson: jest.fn()
}));

describe('UserPersonalisation', () => {
  //Arrange
  const mockKey = 'test-key';
  const mockCallerSource = 'test-source';
  const mockParsedResponse = { name: 'test-value' };
  const mockValue = { name: 'test-value' };
  const mockApiResponse = JSON.stringify({ name: 'test-value' });
  const mockStorableData = {
    [mockKey]: JSON.stringify(mockValue)
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should return cached value if it exists', async () => {
    //Arrange
    (getItem as jest.Mock).mockReturnValue({ [mockKey]: JSON.stringify(mockParsedResponse) });
    (safeParseJson as jest.Mock).mockReturnValue(mockParsedResponse);

    //Act
    const result = await getUserPersonalisation(mockKey, mockCallerSource as CallerSource);

    //Assert
    expect(result).toEqual(mockParsedResponse);
    expect(httpGet).not.toHaveBeenCalled();
    expect(getItem).toHaveBeenCalled();
  });

  test('Should fetch from API and return value if not cached', async () => {
    //Arrange
    (getItem as jest.Mock).mockReturnValue('');
    (httpGet as jest.Mock).mockResolvedValue(mockApiResponse);
    (safeParseJson as jest.Mock).mockReturnValueOnce(mockParsedResponse);
    const updateCachedObjectMock = jest
      .spyOn(require('./user-personalisation'), 'updateCachedObject')
      .mockImplementation(jest.fn());

    //Act
    const result = await getUserPersonalisation(mockKey, mockCallerSource as CallerSource);

    // Expect
    expect(httpGet).toHaveBeenCalledTimes(1);
    expect(updateCachedObjectMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockParsedResponse);
  });

  test('Should return null if API request fails', async () => {
    //Arrange
    (getItem as jest.Mock).mockReturnValue(null);
    jest.mocked(httpGet).mockRejectedValue(new Error('API Error'));

    //Act
    const result = await getUserPersonalisation(mockKey, mockCallerSource as CallerSource);

    //Assert
    expect(result).toBeNull();
    expect(httpGet).toHaveBeenCalled();
  });

  test('Should store data in cache and send API request', async () => {
    //Arrange
    (convertToStorableData as jest.Mock).mockReturnValue(mockStorableData);
    const updateCachedObjectMock = jest
      .spyOn(require('./user-personalisation'), 'updateCachedObject')
      .mockImplementation(jest.fn());

    //Act
    await setUserPersonalisation(mockKey, mockCallerSource as CallerSource, mockValue);

    //Assert
    expect(updateCachedObjectMock).toHaveBeenCalledWith(mockKey, mockStorableData);
    expect(httpPost).toHaveBeenCalled();
  });
});
