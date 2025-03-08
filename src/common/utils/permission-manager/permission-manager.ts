/* eslint-disable max-params */
import {
  AccessType,
  ActionType,
  EntityPermissionDetail,
  IAdditionalData,
  IConfig,
  IEntity,
  INormalizedPermissionTemplate,
  IRestrictionConfig,
  PermissionEntityType
} from './permission-manager.types';
import { getPermissionTemplate } from './permission-normalization';
import {
  canAccessTask,
  checkViewPermission,
  getEntityPermission,
  isFieldRestricted,
  isImportAndExportRestricted,
  isTypeRestricted
} from './utils';

const checkActionRestriction = (
  config: IRestrictionConfig,
  entityType: PermissionEntityType,
  additionalData?: IAdditionalData | undefined,
  normalizedData?: INormalizedPermissionTemplate | null,
  skipTaskUserValidation?: boolean
): boolean => {
  const { entityPermission, entityId, schemaName } = config;
  if (!entityPermission) return false;

  if (entityType === PermissionEntityType.Task) {
    if (!skipTaskUserValidation && !canAccessTask(additionalData, normalizedData?.UserLevelAccess))
      return true;

    return isTypeRestricted(config);
  }
  return isFieldRestricted({
    entityPermission: entityPermission,
    entityId: entityId,
    schemaName: schemaName
  });
};

const getModifiedEntityPermissionType = (
  permissionEntityType: PermissionEntityType,
  entityId?: string,
  actionPermission?: IEntity
): string | undefined => {
  const permissionEntityTypeMap: Record<string, string | undefined> = {
    [PermissionEntityType.Opportunity]: entityId,
    [PermissionEntityType.Accounts]: entityId,
    [PermissionEntityType.Activity]:
      entityId && actionPermission?.[entityId] ? entityId : permissionEntityType
  };
  return permissionEntityTypeMap?.[permissionEntityType] || permissionEntityType;
};

const isRestricted = async (config: IConfig): Promise<boolean> => {
  const { entity, action, entityId, schemaName, additionalData, callerSource } = config;

  const normalizedData = await getPermissionTemplate(callerSource);

  let isActionRestricted = false;

  if (!normalizedData) {
    return isActionRestricted;
  }

  const actionPermission = normalizedData[action.toUpperCase() as ActionType];
  const modifiedEntity = getModifiedEntityPermissionType(entity, entityId, actionPermission);
  const entityPermission = getEntityPermission(
    actionPermission,
    modifiedEntity as PermissionEntityType
  );

  isActionRestricted = checkActionRestriction(
    {
      entityPermission: entityPermission,
      entityId: entityId,
      schemaName: schemaName
    },
    modifiedEntity as PermissionEntityType,
    additionalData,
    normalizedData,
    config.skipTaskUserValidation
  );

  if (isImportAndExportRestricted(entity, action, entityPermission)) {
    return true;
  }

  if (!isActionRestricted && checkViewPermission(modifiedEntity as PermissionEntityType, action)) {
    const viewPermission = actionPermission?.[ActionType.View] as EntityPermissionDetail;
    isActionRestricted = checkActionRestriction(
      {
        entityPermission: viewPermission,
        entityId: entityId ?? '',
        schemaName
      },
      modifiedEntity as PermissionEntityType
    );
  }
  return isActionRestricted;
};

const getRestrictionMap = async (
  schemaNames: string[],
  config: IConfig
): Promise<Record<string, boolean>> => {
  const { entity, action, callerSource, entityId } = config;
  const normalizedData = await getPermissionTemplate(callerSource);
  const permissionMap = {};

  const actionPermission = normalizedData?.[action.toUpperCase() as ActionType];
  const modifiedEntity =
    getModifiedEntityPermissionType(entity, entityId, actionPermission) || entity;

  const entityPermission = actionPermission?.[modifiedEntity] as EntityPermissionDetail;

  const accessType = entityPermission?.Access?.toUpperCase();

  schemaNames?.map((schemaName) => {
    if (accessType === AccessType.FullAccess.toUpperCase()) {
      permissionMap[schemaName] = false;
    }
    if (accessType === AccessType.NoAccess.toUpperCase()) {
      permissionMap[schemaName] = true;
    }
    if (
      accessType === AccessType.PartialAccess.toUpperCase() &&
      entityPermission?.RestrictedFields?.[schemaName]
    ) {
      permissionMap[schemaName] = true;
    }
  });

  return permissionMap;
};

export { isRestricted, getRestrictionMap };
