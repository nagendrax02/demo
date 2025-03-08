import { isRestricted } from './permission-manager';
import { getRestrictedData } from './utils';
import {
  PermissionEntityType,
  IEntityPermissionAccess,
  ActionType,
  AccessType
} from './permission-manager.types';

export { isRestricted, getRestrictedData };

export { PermissionEntityType, ActionType, AccessType };
export type { IEntityPermissionAccess };
