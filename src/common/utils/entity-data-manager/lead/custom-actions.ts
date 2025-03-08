import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { ICustomActions } from 'common/types/entity/lead/custom-actions.types';
import { safeParseJson } from 'common/utils/helpers/helpers';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { EntityType } from '../activity/activity.types';

const fetchCustomActions = async (
  callerSource: CallerSource,
  entityType: EntityType
): Promise<ICustomActions> => {
  try {
    const apiPath =
      entityType === EntityType.Lists
        ? API_ROUTES.getListCustomActions
        : API_ROUTES.getCustomActions;
    const response = await httpGet<string>({
      path: `${apiPath}?entityType=${entityType}`,
      module: Module.Marvin,
      callerSource
    });
    if (response) {
      let actionsMap = safeParseJson(response);
      if (typeof actionsMap === 'string') {
        actionsMap = safeParseJson(actionsMap);
      }
      return actionsMap as ICustomActions;
    }
  } catch (err) {
    trackError(err);
  }
  return {} as ICustomActions;
};

export const getCustomActionsFromCache = async (
  callerSource: CallerSource,
  entityType?: EntityType
): Promise<ICustomActions> => {
  try {
    const type = entityType || EntityType.Lead;
    const actions = getItem(StorageKey.CustomActions) as Record<EntityType, ICustomActions>;
    if (!actions?.[type]) {
      const response = await fetchCustomActions(callerSource, type);
      const cacheData = { ...(actions || {}), [type]: response };
      setItem(StorageKey.CustomActions, cacheData);
      return response;
    }
    return actions[type];
  } catch (err) {
    trackError(err);
  }
  return {} as ICustomActions;
};
