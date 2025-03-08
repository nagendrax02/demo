import { CallerSource } from '../rest-client';

enum PermissionEntityType {
  Lead = 'LEAD',
  Activity = 'ACTIVITY',
  Task = 'TASK',
  Reports = 'REPORTS',
  Apps = 'APPS',
  User = 'USER',
  Users = 'USERS',
  Dashboard = 'DASHBOARD',
  Api = 'API',
  Accounts = 'ACCOUNTS',
  Recordings = 'RECORDINGS',
  Opportunity = 'OPPORTUNITY',
  Marketing = 'MARKETING',
  Content = 'CONTENT'
}

const multipleEntityType = ['OPPORTUNITY', 'ACCOUNTS', 'ACTIVITY'];

enum ActionType {
  Update = 'UPDATE',
  Create = 'CREATE',
  Delete = 'DELETE',
  Export = 'EXPORT',
  Import = 'IMPORT',
  View = 'VIEW',
  MarkComplete = 'MARKCOMPLETE',
  BulkUpdate = 'BULKUPDATE',
  BulkDelete = 'BULKDELETE',
  Access = 'ACCESS',
  BULKCREATE = 'BULKCREATE'
}

interface IConfig {
  entity: PermissionEntityType;
  action: ActionType;
  callerSource: CallerSource;
  entityId?: string;
  schemaName?: string;
  type?: string;
  additionalData?: IAdditionalData;
  skipTaskUserValidation?: boolean;
}

interface IUserLevelAccess {
  Task: string[];
}

interface IPermissionTemplate {
  UserId: string;
  UserLevelAccess?: IUserLevelAccess;
}

interface IPermissions extends IPermissionTemplate {
  EntityPermissions: IEntityPermission[];
}

enum RestrictedEntity {
  RestrictedFields = 'RestrictedFields',
  RestrictedActivities = 'RestrictedActivities',
  RestrictedTaskTypes = 'RestrictedTaskTypes'
}

type IRestrictedPermissionEntity = {
  [R in RestrictedEntity]?: string[];
};

interface IViewPermissionProperty {
  Field: string;
  RestrictionType: string;
}

export interface IPermissionProperties extends IRestrictedPermissionEntity {
  Restrictions: IViewPermissionProperty[];
  ModifiableTaskUsers?: string[];
}

interface IEntityPermission {
  Entity: PermissionEntityType;
  Permissions: IPermission[];
  EntityType: string | null;
}

enum AccessType {
  PartialAccess = 'PartialAccess',
  NoAccess = 'NoAccess',
  FullAccess = 'FullAccess'
}

interface IPermission {
  Action: string | null;
  Access: AccessType | null;
  Properties: IPermissionProperties;
}

export type IEntity = {
  [E in PermissionEntityType]?: EntityPermissionDetail;
};

export type EntityPermissionDetail = {
  Access: AccessType;
  RestrictedFields: Record<string, string> | null;
  RestrictedTypes?: Record<string, string> | null;
};

export type IActionPermission = {
  [Action in ActionType]?: IEntity;
};

interface IRestrictedProperty {
  restrictedProperty: IPermissionProperties;
  entity: PermissionEntityType;
}

interface IAdditionalData {
  ownerId?: string;
  createdById?: string;
}

interface IRestrictionConfig {
  entityPermission: EntityPermissionDetail | undefined;
  entityId?: string;
  schemaName?: string;
}

interface INormalizedPermissionTemplate extends IActionPermission, IPermissionTemplate {}

interface IEntityRestrictionConfig {
  entityType: PermissionEntityType;
  actionType: ActionType;
  callerSource: CallerSource;
  entityId?: string;
}

type IEntityPermissionAccess =
  | {
      accessType: AccessType.NoAccess;
    }
  | {
      accessType: AccessType.FullAccess;
    }
  | {
      accessType: AccessType.PartialAccess;
      RestrictedFields: Record<string, string> | null;
      RestrictedTypes: Record<string, string> | null;
    };

export type {
  IConfig,
  IPermissions,
  INormalizedPermissionTemplate,
  IRestrictedProperty,
  IEntityPermission,
  IPermission,
  IViewPermissionProperty,
  IRestrictionConfig,
  IAdditionalData,
  IUserLevelAccess,
  IEntityRestrictionConfig,
  IEntityPermissionAccess
};

export { PermissionEntityType, ActionType, AccessType, multipleEntityType };
