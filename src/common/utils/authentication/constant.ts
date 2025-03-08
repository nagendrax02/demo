export const AUTH_ERROR_MSG = {
  invalidAuthData: 'Error while authenticating: Invalid Auth Data',
  failedToGetAuthToken: 'failed to get query param auth token'
};

export const AUTH_HEADERS = {
  xLsqAppToken: 'x-lsq-app-token',
  contentType: 'Content-Type'
};

export const AuthConfig = {
  AuthData: 'AuthData',
  UserId: 'UserId',
  OrgCode: 'OrgCode',
  SessionId: 'SessionId'
};

export const MipPreReqData = 'mip_pre_reqdata';
export const MipAuthData = '___mip-auth-data___';

export const UserRole = {
  Admin: 'Admin',
  MarketingUser: 'MarketingUser',
  SalesManager: 'SalesManager',
  SalesUser: 'SalesUser'
};

export const userRoleCodeMap: Record<string, string> = {
  ['7b7b']: UserRole.Admin,
  ['619e']: UserRole.MarketingUser,
  ['e5b8']: UserRole.SalesManager,
  ['e415']: UserRole.SalesUser
};

export const DEFAULT_FAVICON_URL =
  'https://f1.leadsquaredcdn.com/leadsquared/app/LeadSquared/Common/img/favicon.ico?v=1';
