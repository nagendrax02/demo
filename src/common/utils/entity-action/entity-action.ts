import { EntityType } from 'common/types';
import {
  ActionType,
  PermissionEntityType
} from 'src/common/utils/permission-manager/permission-manager.types';
import { LEAD_SCHEMA_NAME } from 'src/apps/entity-details/schema-names';
import { IActionConfig } from 'src/apps/entity-details/types';
import { CHANGE_OWNER, CHANGE_STAGE, CHANGE_STATUS_STAGE } from 'src/common/constants';
import { ACTION } from 'src/apps/entity-details/constants';
import { CallerSource } from '../rest-client';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { isFeatureRestricted } from '../feature-restriction/utils/augment-data';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from '../feature-restriction/feature-restriction.types';

interface IGetEntityActionConfig {
  configData: IActionConfig[];
  entityType: EntityType;
  callerSource: CallerSource;
  id?: string;
  canUpdate?: boolean;
  CanRemoveDelete?: boolean;
}

const getPermissionEntityType = (entityType: EntityType): string => {
  if (entityType === EntityType.Opportunity) {
    return PermissionEntityType.Opportunity;
  } else if (entityType === EntityType.Account) {
    return PermissionEntityType.Accounts;
  }
  return PermissionEntityType.Lead;
};

const getInvokingModule = (entityType: EntityType): CallerSource => {
  switch (entityType) {
    case EntityType.Lead:
      return CallerSource.LeadDetails;
    default:
      return CallerSource.NA;
  }
};

const getOwnerSchemaName = (entityType: EntityType): string => {
  if (entityType === EntityType.Opportunity) {
    return LEAD_SCHEMA_NAME.OWNER;
  }
  return LEAD_SCHEMA_NAME.OWNER_ID;
};

const canRemoveAction = (name: string, permission: Record<string, boolean>): boolean => {
  const isUpdateActionRestricted = permission.isUpdateActionRestricted;
  const isDeleteActionRestricted = permission.isDeleteActionRestricted;
  const isManageListRestricted = permission.isManageListRestricted;

  const isUpdateAction = [
    CHANGE_STAGE,
    CHANGE_OWNER,
    ACTION.Edit,
    CHANGE_STATUS_STAGE,
    ACTION.OpportunityDetailEditVCard
  ].includes(name);

  return (
    (isUpdateAction && isUpdateActionRestricted) ||
    (name === ACTION.Delete && isDeleteActionRestricted) ||
    (name === ACTION.AddToList && isManageListRestricted)
  );
};

const getEntityActionConfig = async (props: IGetEntityActionConfig): Promise<IActionConfig[]> => {
  const { configData, entityType, id, canUpdate = true, callerSource } = props;

  if (!configData?.length) return [];

  const module = await import('../../utils/permission-manager');

  const [isUpdateActionRestricted, isDeleteActionRestricted, isManageListRestricted] =
    await Promise.all([
      module.isRestricted({
        entity: getPermissionEntityType(entityType) as PermissionEntityType,
        action: ActionType.Update,
        entityId: id,
        schemaName: getOwnerSchemaName(entityType) || '',
        callerSource
      }),
      module.isRestricted({
        entity: getPermissionEntityType(entityType) as PermissionEntityType,
        action: ActionType.Delete,
        entityId: id,
        schemaName: getOwnerSchemaName(entityType) || '',
        callerSource
      }),
      isFeatureRestricted({
        actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLists].View,
        moduleName: FeatureRestrictionModuleTypes.ManageLists,
        callerSource
      })
    ]);

  const permission: Record<string, boolean> = {
    isUpdateActionRestricted: isUpdateActionRestricted || !canUpdate,
    isDeleteActionRestricted: isDeleteActionRestricted || !canUpdate,
    isManageListRestricted: isManageListRestricted || false
  };

  const entityActions: IActionConfig[] = [];

  configData?.forEach((config: IActionConfig) => {
    if (canRemoveAction(config?.id, permission)) {
      return;
    }
    entityActions.push(config);
  });

  return entityActions;
};

const getActiveEntityType = (entityIds: IEntityIds): EntityType => {
  if (entityIds?.lead) {
    if (entityIds?.opportunity && !entityIds?.account) {
      return EntityType.Opportunity;
    }
    if (!entityIds?.opportunity && entityIds?.account) {
      return EntityType.Account;
    }
  }
  return EntityType?.Lead;
};

export {
  getEntityActionConfig,
  getPermissionEntityType,
  getOwnerSchemaName,
  canRemoveAction,
  getInvokingModule,
  getActiveEntityType
};
