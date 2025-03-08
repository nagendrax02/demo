import { AvailableTheme } from '@lsq/nextgen-preact/v2/stylesmanager';

interface ITenantDetails {
  OrgCode: string;
}

interface IUserDetails {
  Id: string;
  TimeZone: string;
  OrgCode: string;
  AssociatedPhoneNumbers: string;
  CreatedOn: string;
  DateFormat: string;
  EmailAddress: string;
  FullName: string;
  IsDefaultOwner: string;
  Role: string;
}

export interface IModulesConfig {
  Name: string;
  APIURL: IModuleApiURLConfig;
}

export interface IAuthDetails {
  userId: string;
  orgCode: string;
  sessionId: string;
}

interface IMarvinStorageData {
  Tokens: IAuthDetails;
  User: IUserDetails & { FirstName?: string };
  Tenant: ITenantDetails;
  UserLanguage?: string;
  ThemeConfig?: AvailableTheme;
  appModule?: string;
  FeatureRestrictionData?: {
    userPermissionMap: Record<string, string | number>;
    userActionsMap: Record<string, string | number>;
  };
}

interface IModuleApiURLConfig {
  Name: string;
  FrontEndAPIURL: string;
}

interface IMessageEvent {
  type: string;
  message: unknown;
}

interface IInitDataToSend {
  route: string;
  payload?: unknown;
}

export type { IMarvinStorageData, IUserDetails, ITenantDetails, IMessageEvent, IInitDataToSend };
