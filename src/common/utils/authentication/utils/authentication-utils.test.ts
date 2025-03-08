import { AUTH_ERROR_MSG } from '../constant';
import { isTokenExpired } from './authentication-utils';
import * as ssoLoginUtil from './ssoLogin';

const { getQueryParamsAuthData } = ssoLoginUtil;

const authDataParams = 'exampleAuthData';
const queryParams = `?AuthData=${authDataParams}`;

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('getQueryParamsAuthData', () => {
  it('Should return a error if AuthData is not present', async () => {
    //Arrange
    const mockSearchParams = new URLSearchParams('');
    jest.spyOn(global, 'URLSearchParams').mockReturnValue(mockSearchParams);

    //Act & Assert
    expect(() => getQueryParamsAuthData()).toThrowError(AUTH_ERROR_MSG.invalidAuthData);
  });

  it('should return AuthData from the query parameters', () => {
    //Arrange
    const mockSearchParams = new URLSearchParams(queryParams);
    jest.spyOn(global, 'URLSearchParams').mockReturnValue(mockSearchParams);

    //Act
    const authData = getQueryParamsAuthData();

    //Assert
    expect(authData).toBe(authDataParams);
  });
});

describe('isTokenExpired', () => {
  it('Should return true when tokenExpirationDateInUTC is invalid', () => {
    //Act
    const result = isTokenExpired('');

    //Assert
    expect(result).toBe(true);
  });

  it('Should return false when the token is within its expiry', () => {
    //Arrange
    const futureExpiration = new Date(Date.now() + 1000);

    //Act
    const result = isTokenExpired(futureExpiration.toISOString());

    //Assert
    expect(result).toBe(false);
  });

  it('Should return true when the token has expired', () => {
    //Arrange
    const pastExpiration = new Date(Date.now() - 1000);

    //Act
    const result = isTokenExpired(pastExpiration.toISOString());

    //Assert
    expect(result).toBe(true);
  });

  it('Should return true when an invalid expiration date is provided', () => {
    //Arrange
    const invalidExpiration = '2023-01-01';

    //Act
    const result = isTokenExpired(invalidExpiration);

    //Assert
    expect(result).toBe(true);
  });

  it('Should return true when an error occurs', () => {
    //Arrange
    const errorMock = new Error('Error');
    const dateSpy = jest.spyOn(global.Date, 'now').mockImplementation(() => {
      throw errorMock;
    });

    //Act
    const result = isTokenExpired('2023-01-01T00:00:00.000Z');

    //Assert
    expect(result).toBe(true);

    dateSpy.mockRestore();
  });
});
