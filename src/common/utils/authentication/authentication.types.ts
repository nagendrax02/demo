interface IAuthenticationStatus {
  isLoading: boolean;
  isSuccess: boolean;
}

enum AuthKey {
  Plan = 'p',
  Token = 't',
  Role = 'ro',
  OrgCode = 'o',
  MipMenu = 'am',
  RegionId = 'r',
  UserId = 'uid',
  Industry = 'i',
  SessionId = 's',
  EntityId = 'Id',
  TimeZone = 'tz',
  TimeZoneOffset = 'tzo',
  UserName = 'un',
  ClusterID = 'ci',
  UserEmail = 'uem',
  ProfileImg = 'pi',
  DefinedWeek = 'dw',
  DisplayName = 'dn',
  CompanyLogo = 'cl',
  DateFormat = 'dfm',
  RenewalDate = 'rd',
  SubIndustry = 'si',
  RefreshToken = 'rt',
  CustomerType = 'ct',
  BusinessType = 'bt',
  UserCreatedOn = 'uco',
  RedirectionId = 'rid',
  OppPluralName = 'opn',
  Configuration = 'conf',
  IsDefaultOwner = 'ido',
  HideSwitchBack = 'hsb',
  RedirectionMode = 'rm',
  MarvinSessionId = 'ms',
  ApplicationType = 'at',
  PermissionsToken = 'pt',
  OppSingularName = 'osn',
  AccountTimezone = 'atz',
  TenantCreatedOn = 'tco',
  TokenExpirationTime = 'ex',
  AssociatedPhoneNumbers = 'apn',
  AccountPhoneNumberFormat = 'apnf',
  DefaultCountryCode = 'dcc',
  IdleTimeout = 'it'
}
interface IAuthDetails {
  userId: string;
  orgCode: string;
  sessionId: string;
}

export type { IAuthDetails, IAuthenticationStatus };
export { AuthKey };
