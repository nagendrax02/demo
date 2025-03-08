import * as restClient from '../rest-client';
import * as authentication from './authentication';
import * as utils from './utils/authentication-utils';
import * as helpers from '../helpers';
import * as storageUtils from 'common/utils/storage-manager';
import * as tokenUtils from './utils/token.utils';
import * as ssoLoginUtil from './utils/ssoLogin';
import { waitFor } from '@testing-library/react';
import { IUser } from 'common/types/authentication.types';
import { UserRole } from './constant';
const { initiateSSOLogin } = ssoLoginUtil;
const { isUserAuthenticated, validateMiPAuthentication, getAuthenticationStatus, authDataParser } =
  authentication;
const { getReIssuedTokens } = tokenUtils;

//Arrange
const tokenMock = {
  PermissionsToken: 'PermissionsToken',
  RefreshToken: 'RefreshToken',
  SessionId: 'SessionId',
  Token: 'Token',
  TokenExpirationTime: 'TokenExpirationTime'
};

const tenantMock = {
  Id: '',
  DisplayName: '',
  AccountPhoneNumberFormat: '',
  AccountTimeZone: '',
  OrgCode: '',
  RegionId: '',
  CICOStatusConfiguration: '',
  DefinedWeek: '',
  CustomerType: '',
  DefaultCountryCode: '',
  Plan: '',
  Industry: '',
  SubIndustry: '',
  BusinessType: '',
  RenewalDate: '',
  ClusterID: '',
  CreatedOn: '',
  IdleTimeout: ''
};

const userMock = {
  Id: 'id',
  OrgCode: 'orgCode',
  DateFormat: 'dd/mm/yy',
  TimeZone: 'Asia/Kolkata',
  AssociatedPhoneNumbers: '',
  Role: UserRole.Admin
} as IUser;
const authSuccess = { isLoading: false, isSuccess: true };
const authFailure = { isLoading: false, isSuccess: false };
const authDataParams = 'exampleAuthData';
const queryParams = `?AuthData=${authDataParams}&t=${tokenMock.Token}&rt=${tokenMock.RefreshToken}&o=${userMock.OrgCode}&uid=${userMock.Id}`;

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('initiateSSOLogin', () => {
  it('Should return sso auth config when sso authentication is successful', async () => {
    //Arrange
    const ssoConfigMock = {
      Token: { RefToken: '' }
    };
    jest.spyOn(helpers, 'getEnvConfig').mockReturnValue('authBasePath');
    jest.spyOn(ssoLoginUtil, 'getAuthHeaders').mockImplementation(() => new Headers());
    jest
      .spyOn(restClient, 'httpRequest')
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify(ssoConfigMock), { status: 200 }).json())
      );

    //Act
    const result = await initiateSSOLogin();

    //Assert
    expect(result).toEqual(ssoConfigMock);
  });

  it('Should return null when sso authentication fails', async () => {
    //Arrange
    const responseMock = jest
      .spyOn(restClient, 'httpRequest')
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify({}), { status: 404 }).json())
      );

    //Act
    const result = await initiateSSOLogin();

    //Assert
    expect(result).toEqual(null);

    responseMock.mockRestore();
  });
});

describe('AuthDataParser', () => {
  it('Should return null when tenant and refresh token is not present', () => {
    const mockSearchParams = new URLSearchParams('?Invalid');
    jest.spyOn(global, 'URLSearchParams').mockReturnValue(mockSearchParams);

    const authConfig = authDataParser();

    expect(authConfig).toBe(null);
  });

  it('Should return auth config when tenant and refresh token is present', () => {
    const mockSearchParams = new URLSearchParams(queryParams);
    jest.spyOn(global, 'URLSearchParams').mockReturnValue(mockSearchParams);

    const authConfig = authDataParser();

    expect(authConfig?.Tokens.Token).toBe(tokenMock.Token);
    expect(authConfig?.Tokens.RefreshToken).toBe(tokenMock.RefreshToken);
    expect(authConfig?.User.Id).toBe(userMock.Id);
    expect(authConfig?.User.OrgCode).toBe(userMock.OrgCode);
  });
});

describe('getReIssuedTokens', () => {
  it('should return null when token and refreshToken is present', async () => {
    //Act
    const token = await getReIssuedTokens(restClient.CallerSource.NA);

    //Assert
    expect(token).toEqual(null);
  });

  it('should return null when token and refreshToken is present and reIssuedToken is not present', async () => {
    //Arrange
    jest
      .spyOn(restClient, 'httpRequest')
      .mockImplementation(() => Promise.resolve(new Response(null, { status: 200 }).json()));

    //Act
    const token = await getReIssuedTokens(restClient.CallerSource.NA);

    //Assert
    expect(token).toEqual(null);
  });

  it('should return null when token and refreshToken is present and reIssuedToken api call fails', async () => {
    //Arrange
    const responseMock = jest
      .spyOn(restClient, 'httpRequest')
      .mockImplementation(() =>
        Promise.resolve(new Response('errorResponse', { status: 400 }).json())
      );

    //Act
    const token = await getReIssuedTokens(restClient.CallerSource.NA);

    //Assert
    expect(token).toEqual(null);
    responseMock.mockRestore();
  });
  it('should return reIssuedToken when reIssue call is success ', async () => {
    //Arrange
    const reIssuedToken = { Tokens: { refreshToken: 'asd' } };
    const responseMock = jest
      .spyOn(restClient, 'httpRequest')
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify(reIssuedToken), { status: 200 }).json())
      );

    //Act
    const token = await getReIssuedTokens(restClient.CallerSource.NA);

    //Assert
    expect(token).toEqual(reIssuedToken);
    responseMock.mockRestore();
  });
});

describe('Is User Authenticated', () => {
  it('Should return false when tokenDetails is invalid', async () => {
    //Arrange
    jest.spyOn(authentication, 'getTokenConfig').mockReturnValue(null);

    //Act
    const result = await isUserAuthenticated();

    //Assert
    expect(result).toBe(false);
  });

  it('Should return false when any error occurs while validating the authentication ', async () => {
    //Arrange
    jest
      .spyOn(authentication, 'getTokenConfig')
      //@ts-ignore: need to check error case
      .mockReturnValue(new Error('asdf'));
    jest.spyOn(utils, 'isTokenExpired').mockReturnValue(false);

    //Act
    const result = await isUserAuthenticated();

    //Assert
    expect(result).toBe(false);
  });

  it('Should return false when Token is not present in tokenConfig', async () => {
    //Arrange
    jest.spyOn(authentication, 'getTokenConfig').mockReturnValue({ ...tokenMock, Token: '' });
    jest.spyOn(utils, 'isTokenExpired').mockReturnValue(true);

    //Act
    const result = await isUserAuthenticated();

    //Assert
    expect(result).toBe(false);
  });

  it('Should return true when tokenDetails is within expiry', async () => {
    //Arrange
    jest.spyOn(authentication, 'getTokenConfig').mockReturnValue(tokenMock);
    jest.spyOn(utils, 'isTokenExpired').mockReturnValue(false);

    //Act
    const result = await isUserAuthenticated();

    //Assert
    expect(result).toBe(true);
  });

  it('Should return false when Token is not present in getReIssuedTokens', async () => {
    //Arrange
    jest.spyOn(authentication, 'getTokenConfig').mockReturnValue(tokenMock);
    jest.spyOn(utils, 'isTokenExpired').mockReturnValue(true);
    jest.spyOn(tokenUtils, 'getReIssuedTokens').mockResolvedValue(null);

    //Act
    const result = await isUserAuthenticated();

    //Assert
    expect(result).toBe(false);
  });

  it('Should return true when Token and RefreshToken is present in getReIssuedTokens', async () => {
    //Arrange
    jest.spyOn(authentication, 'getTokenConfig').mockReturnValue(tokenMock);
    jest.spyOn(utils, 'isTokenExpired').mockReturnValue(true);
    jest
      .spyOn(tokenUtils, 'getReIssuedTokens')
      .mockResolvedValue({ Tokens: tokenMock, Tenant: tenantMock, User: userMock, SessionId: '' });

    //Act
    const result = await isUserAuthenticated();

    //Assert
    expect(result).toBe(true);
  });

  it('Should return true when Token is not present in getReIssuedTokens', async () => {
    //Arrange
    jest.spyOn(authentication, 'getTokenConfig').mockReturnValue(tokenMock);
    jest.spyOn(utils, 'isTokenExpired').mockReturnValue(true);
    jest.spyOn(tokenUtils, 'getReIssuedTokens').mockResolvedValue({
      Tokens: { ...tokenMock, Token: '' },
      Tenant: tenantMock,
      User: userMock,
      SessionId: ''
    });

    //Act
    const result = await isUserAuthenticated();

    //Assert
    expect(result).toBe(false);
  });
  it('Should return true when RefreshToken is not present in getReIssuedTokens', async () => {
    //Arrange
    jest.spyOn(authentication, 'getTokenConfig').mockReturnValue(tokenMock);
    jest.spyOn(utils, 'isTokenExpired').mockReturnValue(true);
    jest.spyOn(tokenUtils, 'getReIssuedTokens').mockResolvedValue({
      Tokens: { ...tokenMock, RefreshToken: '' },
      Tenant: tenantMock,
      User: userMock,
      SessionId: ''
    });

    //Act
    const result = await isUserAuthenticated();

    //Assert
    expect(result).toBe(false);
  });
});

describe('validateMiPAuthentication', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should return true when isUserAuthenticated returns true', async () => {
    //Arrange
    jest.spyOn(authentication, 'isUserAuthenticated').mockResolvedValue(true);
    jest.spyOn(utils, 'validateUserDetails').mockImplementation(() => false);

    //Act
    const result = await validateMiPAuthentication();

    //Assert
    expect(result).toEqual(true);
  });

  it('Should return false when initiateSSOLogin and authDateParser returns null', async () => {
    //Arrange
    jest.spyOn(authentication, 'isUserAuthenticated').mockResolvedValue(false);
    jest.spyOn(ssoLoginUtil, 'initiateSSOLogin').mockResolvedValue(null);
    jest.spyOn(authentication, 'authDataParser').mockImplementation(() => null);

    //Act
    const result = await validateMiPAuthentication();

    //Assert
    expect(result).toEqual(false);
  });

  it('Should return false when initiateSSOLogin returned value does not have Token', async () => {
    //Arrange
    jest.spyOn(authentication, 'isUserAuthenticated').mockResolvedValue(false);
    jest.spyOn(ssoLoginUtil, 'initiateSSOLogin').mockResolvedValue({
      Tokens: { ...tokenMock, Token: '' },
      Tenant: tenantMock,
      User: userMock,
      SessionId: ''
    });

    //Act
    const result = await validateMiPAuthentication();

    //Assert
    expect(result).toEqual(false);
  });

  it('Should return true when initiateSSOLogin returned value does not have Token', async () => {
    //Arrange
    jest.spyOn(authentication, 'isUserAuthenticated').mockResolvedValue(false);
    jest
      .spyOn(ssoLoginUtil, 'initiateSSOLogin')
      .mockResolvedValue({ Tokens: tokenMock, Tenant: tenantMock, User: userMock, SessionId: '' });

    //Act
    const result = await validateMiPAuthentication();

    //Assert
    expect(result).toEqual(true);
  });

  it('Should clear persisted auth data and initiate sso call when url userId and orgCode is changed', async () => {
    //Arrange
    const clearStorageMock = jest
      .spyOn(storageUtils, 'clearStorage')
      .mockImplementation(() => true);
    jest.spyOn(utils, 'validateUserDetails').mockReturnValue(true);

    const initiateSSOLoginMock = jest
      .spyOn(ssoLoginUtil, 'initiateSSOLogin')
      .mockResolvedValue({ Tokens: tokenMock, Tenant: tenantMock, User: userMock, SessionId: '' });

    await waitFor(async () => {
      //Act
      await validateMiPAuthentication();

      //Assert
      expect(clearStorageMock).toHaveBeenCalled();
      expect(initiateSSOLoginMock).toHaveBeenCalled();
    });
  });

  it('Should initiate sso login when authDataParser return null', async () => {
    const mockSearchParams = new URLSearchParams('?Invalid');
    jest.spyOn(global, 'URLSearchParams').mockReturnValue(mockSearchParams);
    jest.spyOn(ssoLoginUtil, 'initiateSSOLogin').mockResolvedValue(null);

    await validateMiPAuthentication();

    await waitFor(() => {
      expect(ssoLoginUtil.initiateSSOLogin).toHaveBeenCalledTimes(1);
    });
  });
});

describe('getAuthenticationStatus', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should returns { isLoading: false, isSuccess: false } when it is not an MiP', async () => {
    //Arrange
    jest.spyOn(helpers, 'isMiP').mockReturnValue(false);

    //Act
    const result = await getAuthenticationStatus();

    //Assert
    expect(result).toEqual(authFailure);
  });

  it('Should returns { isLoading: false, isSuccess: true } when it is MiP and authentication is success', async () => {
    //Arrange
    jest.spyOn(helpers, 'isMiP').mockReturnValue(true);
    jest.spyOn(authentication, 'validateMiPAuthentication').mockResolvedValue(true);

    //Act
    const result = await getAuthenticationStatus();

    //Assert
    expect(result).toEqual(authSuccess);
  });
});
