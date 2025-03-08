import { AvailableTheme } from '@lsq/nextgen-preact/v2/stylesmanager';
import { IBulkSubmissionConfig } from './bulk-submission.types';
import { AssociatedEntity } from './common.types';
import { IFormWithDefaultConfig } from './default-forms-config.types';
import {
  IPreLoadFieldSettings,
  IPreLoadFieldSettingsConfig
} from './preload-field-setting-configs.types';
import {
  IPrepopulateFieldConfig,
  IPrepopulateFieldConfigValue
} from './prepopulation-config.types';
import { IProcessActionExecutorResponse } from './process-forms.types';

export interface IAuthDetails {
  Token: string;
  RefreshToken: string;
  RefreshTokenExpirationTime: string;
  PermissionsToken?: string;
  TokenExpirationTime: string;
  TokenValidityInMinutes: number;
}

export interface IUserDetails {
  Id: string;
  TimeZone: string;
  OrgCode: string;
}

export interface ITenantDetails {
  OrgCode: string;
}

interface IModuleApiURLConfig {
  Name: string;
  FrontEndAPIURL: string;
}
export interface IModulesConfig {
  Name: string;
  APIURL: IModuleApiURLConfig;
}

export interface IStorageData {
  Tokens: IAuthDetails;
  User: IUserDetails;
  Tenant: ITenantDetails;
  ModulesConfig: IModulesConfig[];
}

export interface IFormDataToBePassed {
  storageData: IStorageData;
  formData: IFormsConfigurationDataToBePassed;
  state: string;
  themeConfig: AvailableTheme;
}

export interface IFormSessionDetail {
  start: string | undefined;
  end: string | undefined;
  action: string | undefined;
}

export interface IFormConfig extends IProcessActionExecutorResponse, IFormWithDefaultConfig {
  draftId?: string;
  availableDraftIds?: string[];
  EntityTypeId?: string;
  FormId?: string;
  LeadId?: string;
  ActivityId?: string;
  OpportunityId?: string;
  TaskId?: string;
  applyOptimization?: boolean;
  ExecutionId?: string;
  ActionId?: string;
  ProcessDesignerId?: string;
  IsDefaultForm?: boolean;
  BulkConfig?: IBulkSubmissionConfig;
  AssociatedEntity?: AssociatedEntity;
  EnableSaveAndDispose?: boolean;
  PrePopulateConfiguration?: IPrepopulateFieldConfig[];
  AccountId?: string;
  AccountActivityCode?: string;
  AccountActivityId?: string;
  CustomEntityIdMapping?: Record<string, string | undefined>;
  IsFromMarkTaskComplete?: boolean;
  CustomEntityWorkAreaId?: string;
  AdditionalSubmissionData?: Record<string, unknown>;
  PreLoadFieldSettingsConfig?: IPreLoadFieldSettingsConfig[];
  SessionInfo?: IFormSessionDetail[];
  IsBulkAction?: boolean;
  IsActivityRestricted?: boolean;
}

export declare type IFormOnSuccessCallBack = ICommonFormSaveCallBack;
export declare type IFormOnFailCallBack = ICommonFormSaveCallBack;
interface ICommonFormSaveCallBack {
  FormData: Record<string, unknown>;
  Response: Record<string, unknown>;
  IsSaveAndDispose: boolean;
}

export interface IFormData {
  Config: IFormConfig;
  OnSuccess?: (saveFormCallBackConfig: IFormOnSuccessCallBack) => void;
  OnError?: (failFormCallBackConfig: IFormOnFailCallBack) => void;
  FormDefinitionPromise?: Promise<unknown>;
  PermissionTemplatePromise?: Promise<unknown>;
  OnShowFormChange?: (showForm: boolean) => void;
  ShowForm?: (formData: IFormConfig) => void;
}

export interface IFormsConfigurationDataToBePassed extends IFormData {
  SetShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  CallBackNameSet?: Set<string>;
}

export type IFormsConfiguration = Omit<IFormsConfigurationDataToBePassed, 'SetShowModal'>;

export interface IRemoteFormConfig
  extends Omit<IFormConfig, 'PrePopulateConfiguration' | 'PreLoadFieldSettingsConfig'> {
  PrePopulateConfiguration?: Map<string, string | IPrepopulateFieldConfigValue>;
  PreLoadFieldSettingsConfig?: Map<string, IPreLoadFieldSettings>;
}

export interface IRemoteFormData extends Omit<IFormData, 'Config'> {
  SetShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  Config?: IRemoteFormConfig;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    tabsToUpdate: Record<string, boolean>;
  }
}
