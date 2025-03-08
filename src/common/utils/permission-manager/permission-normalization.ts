import { trackError } from 'common/utils/experience/utils/track-error';
import {
  IActionPermission,
  IEntityPermission,
  IRestrictedProperty,
  INormalizedPermissionTemplate,
  IPermission,
  IPermissionProperties,
  IPermissions,
  PermissionEntityType,
  multipleEntityType
} from './permission-manager.types';

import { API_ROUTES } from 'common/constants';

import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { addUserLevelAccess } from './utils';

const convertArrayToObject = <T>(arr: T[]): Record<string, T> => {
  const obj: Record<string, T> = {};
  if (arr?.length) {
    arr.forEach((element: T): void => {
      obj[`${element}`] = element;
    });
  }
  return obj;
};

const getProperty = (restrictedProperty: IPermissionProperties): Record<string, string> | null => {
  let clonedRestrictedFields = {};
  if (restrictedProperty?.RestrictedFields?.length) {
    clonedRestrictedFields = convertArrayToObject(restrictedProperty.RestrictedFields);
  }
  return clonedRestrictedFields;
};

const getRestrictedTaskTypes = (
  restrictedProperty: IPermissionProperties
): Record<string, string> | null => {
  let restrictedTypes = {};
  if (restrictedProperty?.RestrictedTaskTypes?.length) {
    restrictedTypes = convertArrayToObject(restrictedProperty.RestrictedTaskTypes);
  }
  return restrictedTypes;
};

const getRestrictedActivityCode = (
  restrictedProperty: IPermissionProperties
): Record<string, string> | null => {
  return restrictedProperty?.RestrictedActivities?.length
    ? convertArrayToObject(restrictedProperty.RestrictedActivities)
    : {};
};

const getRestrictedProperty = (
  property: IRestrictedProperty
): Record<string, Record<string, string> | null> => {
  let restrictedFields: Record<string, string> | null = null;
  let restrictedTypes: Record<string, string> | null = null;
  const { restrictedProperty, entity } = property;

  const handleProperty = {
    [PermissionEntityType.Lead]: (): void => {
      restrictedFields = getProperty(restrictedProperty);
    },
    [PermissionEntityType.Task]: (): void => {
      restrictedTypes = getRestrictedTaskTypes(restrictedProperty);
    },
    [PermissionEntityType.Activity]: (): void => {
      restrictedTypes = getRestrictedActivityCode(restrictedProperty);
    }
  };

  if (handleProperty[entity]) handleProperty[entity]();
  else {
    restrictedFields = getProperty(restrictedProperty);
  }

  if (restrictedProperty?.Restrictions?.length) {
    if (!restrictedFields) restrictedFields = {};
    const restrictedField = restrictedFields as Record<string, string>;
    restrictedProperty.Restrictions.forEach((restriction) => {
      restrictedField[restriction.Field] = restriction.Field;
    });
  }

  return { restrictedFields, restrictedTypes };
};

const getRequiredEntities = (): PermissionEntityType[] => {
  return [
    PermissionEntityType.Lead,
    PermissionEntityType.Task,
    PermissionEntityType.Content,
    PermissionEntityType.Activity,
    PermissionEntityType.Accounts
  ];
};

const persistPermissionConfig = (normalizedPermission: INormalizedPermissionTemplate): void => {
  setItem(StorageKey.Permissions, normalizedPermission);
};

const getNormalizedPermissionFromStorage = (): INormalizedPermissionTemplate | null => {
  return getItem(StorageKey.Permissions);
};

// eslint-disable-next-line max-lines-per-function
const getNormalizedPermission = (permissions: IPermissions): INormalizedPermissionTemplate => {
  const normalizedPermissions: INormalizedPermissionTemplate = {
    UserId: permissions.UserId
  };

  permissions.EntityPermissions?.forEach((entityPermission: IEntityPermission) => {
    const { Entity, Permissions, EntityType } = entityPermission;

    const entityType = Entity?.toUpperCase() as PermissionEntityType;

    //Below condition is temporary, this we are using to capture just lead data , if required other entity data also then below condition can be removed.
    const requiredEntities = getRequiredEntities();
    if (
      !entityType ||
      (entityType &&
        !(
          requiredEntities.includes(entityType) ||
          multipleEntityType.includes(EntityType?.toUpperCase() || '')
        ))
    )
      return;

    Permissions?.forEach((permission: IPermission) => {
      const { Action, Access, Properties } = permission;
      const actionType = Action?.toUpperCase();

      if (Properties?.ModifiableTaskUsers && entityType === PermissionEntityType.Task) {
        normalizedPermissions.UserLevelAccess = addUserLevelAccess(Properties);
      }

      if (!actionType) return;

      const normalizedPermission = (normalizedPermissions[actionType] || {}) as IActionPermission;

      if (!normalizedPermission?.[entityType]) {
        const { restrictedFields, restrictedTypes } = getRestrictedProperty({
          restrictedProperty: Properties,
          entity: entityType as PermissionEntityType
        });
        normalizedPermission[entityType] = {
          Access: Access?.toUpperCase(),
          RestrictedFields: restrictedFields,
          RestrictedTypes: restrictedTypes
        };
      }

      normalizedPermissions[actionType] = normalizedPermission;
    });
  });

  persistPermissionConfig(normalizedPermissions);
  return normalizedPermissions;
};

const getPermissionTemplate = async (
  callerSource: CallerSource
): Promise<INormalizedPermissionTemplate | null> => {
  try {
    const permission = getNormalizedPermissionFromStorage();
    if (permission) return permission;

    const path = API_ROUTES.permission;
    const response = (await httpGet({
      path,
      module: Module.Marvin,
      callerSource
    })) as IPermissions;
    return getNormalizedPermission(response);
  } catch (error) {
    trackError(error);
  }
  return null;
};

export { getPermissionTemplate, getNormalizedPermission, convertArrayToObject };
