import { IWorkAreaConfig } from 'common/utils/process/process.types';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ActionType, PermissionEntityType } from 'common/utils/permission-manager';
import { IFormConfig } from 'apps/forms/forms.types';

export interface IFormData {
  workAreaConfig: IWorkAreaConfig;
}

export interface IGetIsRestrictedData {
  permissionEntityType: PermissionEntityType;
  actionType: ActionType;
  entityId: string;
}

export interface ICasaHelperUtils {
  showNotification: (type: Type, message: string) => void;
  getIsRestricted: (data: IGetIsRestrictedData) => Promise<boolean>;
  showForms: (formsConfig: IFormConfig) => void;
  handleLogOut: () => Promise<void>;
}
