import { UserRole } from '../authentication/constant';
import { StorageKey, getItem } from '../storage-manager';
import {
  IRestrictionConfig,
  AccessType,
  IEntity,
  PermissionEntityType,
  EntityPermissionDetail,
  ActionType,
  IAdditionalData,
  IPermissionProperties,
  IUserLevelAccess,
  IEntityRestrictionConfig,
  IEntityPermissionAccess
} from './permission-manager.types';
import { getPermissionTemplate } from './permission-normalization';
import { IAuthenticationConfig } from 'common/types';

const isFieldRestricted = (fieldConfig: IRestrictionConfig): boolean => {
  const { entityPermission, entityId, schemaName } = fieldConfig;
  if (!entityPermission) return false;

  const { Access, RestrictedFields, RestrictedTypes } = entityPermission;

  const isRestricted = {
    [AccessType.NoAccess.toUpperCase()]: (): boolean => true,
    [AccessType.PartialAccess.toUpperCase()]: (): boolean => {
      if (
        (entityId && (RestrictedFields?.[entityId] || RestrictedTypes?.[entityId])) ||
        (schemaName && RestrictedFields?.[schemaName])
      )
        return true;
      return false;
    }
  };
  return isRestricted[Access] ? isRestricted[Access]() : false;
};

const isTypeRestricted = (config: IRestrictionConfig): boolean => {
  const { entityPermission, entityId } = config;
  if (!entityPermission) return false;

  const { Access, RestrictedTypes } = entityPermission;
  const isRestricted = {
    [AccessType.NoAccess.toUpperCase()]: (): boolean => true,
    [AccessType.PartialAccess.toUpperCase()]: (): boolean => {
      if (entityId && RestrictedTypes?.[entityId]) return true;
      return false;
    }
  };
  return isRestricted[Access] ? isRestricted[Access]() : false;
};

const getEntityPermission = (
  actionPermission: IEntity | undefined,
  entity: PermissionEntityType
): EntityPermissionDetail | undefined => {
  return actionPermission?.[entity?.toUpperCase() as PermissionEntityType];
};

const checkViewPermission = (entity: PermissionEntityType, action: ActionType): boolean => {
  return (
    entity?.toUpperCase() === PermissionEntityType.Lead &&
    action.toUpperCase() === ActionType.Update
  );
};

const hasUserLevelAccess = (
  userLevelAccess: IUserLevelAccess | undefined,
  ownerId: string | undefined
): boolean => {
  if (userLevelAccess) {
    return userLevelAccess?.Task.includes(ownerId || '');
  }
  // if no userLevelAccess permissons, then there are no restrictions
  return true;
};

const canAccessTask = (
  additionalData: IAdditionalData | undefined,
  userLevelAccess?: IUserLevelAccess
): boolean => {
  const { ownerId, createdById } = additionalData || {};
  const { User } = (getItem(StorageKey.Auth) || {}) as IAuthenticationConfig;
  const allowedUserRoles = [UserRole.Admin, UserRole.MarketingUser, UserRole.SalesManager];
  return (
    ownerId === User?.Id ||
    createdById === User?.Id ||
    allowedUserRoles.includes(User?.Role) ||
    hasUserLevelAccess(userLevelAccess, ownerId)
  );
};

const isImportAndExportRestricted = (
  entityType: PermissionEntityType,
  actionType: ActionType,
  entityPermission?: EntityPermissionDetail
): boolean => {
  if (
    [PermissionEntityType.Accounts, PermissionEntityType.Opportunity].includes(entityType) &&
    [ActionType?.Export, ActionType?.Import].includes(actionType?.toUpperCase() as ActionType)
  ) {
    const userRole = ((getItem(StorageKey.Auth) || {}) as IAuthenticationConfig)?.User?.Role;
    return userRole === UserRole.SalesUser && !entityPermission ? true : false;
  }
  return false;
};

const addUserLevelAccess = (properties: IPermissionProperties): IUserLevelAccess => {
  return {
    Task: properties?.ModifiableTaskUsers || []
  };
};

const isValidRestrictionConfig = (restrictionConfig: IEntityRestrictionConfig): boolean => {
  if (!restrictionConfig || !restrictionConfig.actionType || !restrictionConfig.entityType) {
    return false;
  }
  return true;
};

const isValidActionPermission = (actionPermission: IEntity, entityType): boolean => {
  if (!actionPermission || !actionPermission[entityType]) {
    return false;
  }
  return true;
};

// eslint-disable-next-line complexity
const getRestrictedData = async (
  restrictionConfig: IEntityRestrictionConfig
): Promise<IEntityPermissionAccess> => {
  const { entityType, actionType, entityId = '', callerSource } = restrictionConfig;

  if (!isValidRestrictionConfig(restrictionConfig)) {
    return Promise.resolve({ accessType: AccessType.FullAccess });
  }

  const normalizedData = await getPermissionTemplate(callerSource);
  const modifiedEntityType: string =
    entityType === PermissionEntityType.Opportunity || entityType === PermissionEntityType.Accounts
      ? entityId
      : entityType;

  const restrictionType: IEntityPermissionAccess = {
    accessType: AccessType.FullAccess
  };

  if (!normalizedData) {
    return restrictionType;
  }

  const actionPermission: IEntity = normalizedData[actionType?.toUpperCase()] as IEntity;
  if (!isValidActionPermission(actionPermission, modifiedEntityType)) {
    return restrictionType;
  }

  const entityPermission = actionPermission[modifiedEntityType] as EntityPermissionDetail;
  if (!entityPermission) {
    return restrictionType;
  }

  if (entityPermission.Access === AccessType.NoAccess) {
    return { accessType: AccessType.NoAccess };
  }

  if (entityPermission.Access?.toLowerCase() === AccessType.PartialAccess?.toLowerCase()) {
    return {
      accessType: AccessType.PartialAccess,
      RestrictedFields: entityPermission.RestrictedFields,
      RestrictedTypes: entityPermission.RestrictedTypes || null
    };
  }

  return restrictionType;
};

export {
  isFieldRestricted,
  getEntityPermission,
  checkViewPermission,
  isTypeRestricted,
  canAccessTask,
  addUserLevelAccess,
  getRestrictedData,
  isImportAndExportRestricted
};
