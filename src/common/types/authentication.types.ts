export interface IToken {
  Token: string;
  RefreshToken: string;
  PermissionsToken: string;
  SessionId?: string;
  TokenExpirationTime: string;
}

export interface IUser {
  Id: string;
  OrgCode: string;
  DateFormat: string;
  TimeZone: string;
  TimeZoneOffset: string;
  AssociatedPhoneNumbers: string;
  EmailAddress: string;
  Role: string;
  CreatedOn: string;
  IsDefaultOwner: string;
  FullName?: string;
  ProfilePhoto?: string;
  AutoCheckOutOnSignOut?: boolean;
  AvailabilityStatus?: string;
  IsCheckInCheckOutEnabled?: boolean;
  MandateWebUserCheckIn?: boolean;
  FirstName?: string;
  LastName?: string;
}
export interface ITenant {
  RegionId: string;
  DefinedWeek: string;
  AccountTimeZone: string;
  DisplayName: string;
  AccountPhoneNumberFormat: string;
  CustomerType: string;
  Industry: string;
  SubIndustry: string;
  BusinessType: string;
  Plan: string;
  ClusterID: string;
  CreatedOn: string;
  RenewalDate: string;
  DefaultCountryCode: string;
  CICOStatusConfiguration?: string;
  IdleTimeout?: string;
}

export interface IModuleConfig {
  OrgCode: string;
  RegionId: string;
  Id: number;
  Name: string;
  Category: number;
  AppURL?: string;
  HasDynamicChildren?: boolean;
  ChildConfig: {
    RelativeURL: string;
    IsDynamic: boolean;
  };
  DisplayConfig: {
    DisplayName: string;
    Icon: string;
    SortOrder: number;
    IconColor?: string;
  };
  RouteConfig: {
    ModuleName?: string;
    Scope?: string;
    RoutePath: string;
    IsDefault: boolean;
    BaseURL?: string;
  };
  IsDisabled: boolean;
  APIURL: {
    Name: string;
    BackEndAPIURL: string;
    FrontEndAPIURL: string;
  };
  IsExternal: boolean;
  ExternalAppConfig?: {
    IntegrationMode: number;
    Position: number;
    ScriptURL?: string;
    Attributes?: string;
    InlineStyleJSON?: string;
  };
  ShowIn?: {
    Mobile: boolean;
    Web: boolean;
  };
  WorkArea: number;
}

interface ILaunchConfig {
  IsTopMenuEnabled: boolean;
  LogoURL: string;
  FavIconURL: string;
  IsDarkModeEnabled: boolean;
  ThemeColor: string;
  DarkThemeColor: string;
}

export interface IAuthenticationConfig {
  Tokens: IToken;
  Tenant: ITenant;
  User: IUser;
  SessionId?: string;
  ModulesConfig?: Record<string, IModuleConfig>;
  LaunchConfig?: ILaunchConfig;
}
