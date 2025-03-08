import { ICustomActions } from 'common/types/entity/lead/custom-actions.types';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';
import { ActionRenderType, IActionConfig } from 'apps/entity-details/types';
import { IConnectorConfig } from 'common/types/entity/lead';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { trackError } from 'common/utils/experience';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { IList } from 'common/types/entity/list/list.types';
import {
  HIDE_ALL_LEAD_LIST_ACTIONS,
  HIDE_DYNAMIC_AND_REFRESHABLE_ACTIONS,
  LIST_UPDATE_ALL_LEAD
} from './constants';
import { ACTION } from 'apps/entity-details/constants';
import {
  INTERNAL_LIST,
  LIST_SEND_EMAIL_LIMIT
} from 'apps/smart-views/components/custom-tabs/manage-lists/constants';
import { ListType } from 'apps/smart-views/smartviews.types';
import { getListId } from 'common/utils/helpers/helpers';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';

const actionsReducer = ({
  item,
  moreActions
}: {
  item: IActionConfig;
  moreActions: IActionMenuItem[];
}): IActionMenuItem[] => {
  if (item.key) {
    moreActions.push({
      ...item,
      label: item.title,
      value: item.key,
      type: ActionRenderType.Dropdown
    });
  }
  return moreActions;
};

const subMenuAction = ({
  actionSubmenu,
  moreActions,
  key
}: {
  actionSubmenu: IActionMenuItem[];
  moreActions: IActionConfig[];
  key: string;
}): void => {
  if (actionSubmenu.length === 1) {
    moreActions.push({
      ...actionSubmenu[0]
    });
  } else {
    moreActions.push({
      label: key,
      value: key,
      subMenu: [...actionSubmenu],
      id: key,
      title: key,
      actionHandler: {},
      type: ActionRenderType.Dropdown
    });
  }
};

const appendCustomActions = ({
  customActions,
  moreActions
}: {
  customActions: ICustomActions;
  moreActions: IActionConfig[];
}): IActionConfig[] => {
  if (customActions?.Single) {
    Object.keys(customActions?.Single)?.forEach((key) => {
      const actions = customActions?.Single?.[key] as IConnectorConfig[];
      if (actions?.length) {
        const actionSubmenu = [] as IActionMenuItem[];
        actions.forEach((item) => {
          actionsReducer({
            item: {
              id: item.Id,
              title: item.Config.DisplayText,
              toolTip: item.Config.DisplayText,
              connectorConfig: item,
              key: item.Id,
              actionHandler: {}
            },
            moreActions: actionSubmenu
          });
        });
        if (actionSubmenu.length) {
          subMenuAction({
            actionSubmenu,
            moreActions,
            key
          });
        }
      }
    });
  }
  return moreActions;
};

const hideInternalActions = (
  entityData: IList,
  newListActions: IActionConfig[]
): IActionConfig[] => {
  if (entityData?.details?.InternalName === INTERNAL_LIST.STARRED_LEADS) {
    return newListActions?.filter((action) => action?.id !== ACTION.ListEdit);
  } else if (entityData?.details?.InternalName === INTERNAL_LIST.ALL_LEADS) {
    return newListActions
      ?.filter((action) => !HIDE_ALL_LEAD_LIST_ACTIONS.includes(action?.id))
      ?.map((action) => {
        if (
          action?.id === ACTION.UpdateAllLead &&
          entityData?.details?.MemberCount > LIST_UPDATE_ALL_LEAD.MAX
        ) {
          return {
            ...action,
            disabled: true,
            toolTip: `You can update only ${LIST_UPDATE_ALL_LEAD.MAX} ${entityData?.metaData?.LeadRepresentationConfig?.PluralName} in this list`
          };
        }
        return action;
      });
  }
  return newListActions;
};

const reduceActions = ({
  listStaticActions,
  entityData
}: {
  listStaticActions: IActionConfig[];
  entityData: IList;
}): IActionConfig[] => {
  let newListActions = listStaticActions;
  newListActions = hideInternalActions(entityData, newListActions);

  if (
    entityData?.details?.ListType === ListType.DYNAMIC ||
    entityData?.details?.ListType === ListType.REFRESHABLE
  ) {
    newListActions = newListActions?.filter(
      (action) => !HIDE_DYNAMIC_AND_REFRESHABLE_ACTIONS.includes(action?.id)
    );
  }

  if (entityData?.details?.MemberCount > LIST_SEND_EMAIL_LIMIT.MAX) {
    newListActions = newListActions?.map((action) => {
      if (action?.id === ACTION.SendEmail) {
        return { ...action, disabled: true };
      }
      return action;
    });
  }

  return newListActions;
};

const handleDeleteList = async (): Promise<void> => {
  const listId = getListId();
  try {
    await httpPost({
      path: API_ROUTES.listDelete,
      module: Module.Marvin,
      body: {
        ListIds: [listId]
      },
      callerSource: CallerSource.ListDetails
    });
    showNotification({
      type: Type.SUCCESS,
      message: 'List deleted successfully'
    });
  } catch (err) {
    trackError(err);
    showNotification({
      type: Type.ERROR,
      message: `${err?.response?.ExceptionMessage || err?.message || ERROR_MSG.generic}`
    });
  }
};

const getListActions = (actions: IActionConfig[], entityData: IList): IActionConfig[] => {
  const singularNameList = [ACTION.QuickAddLead, ACTION.AddNewLead];
  const pluralNameList = [
    ACTION.DeleteAllLead,
    ACTION.UpdateAllLead,
    ACTION.ExportLead,
    ACTION.ListAddMore
  ];
  return actions?.map((action) => {
    if (singularNameList.includes(action?.id)) {
      return {
        ...action,
        title: `${action?.title} ${
          entityData?.metaData?.LeadRepresentationConfig?.SingularName ?? 'Lead'
        }`,
        toolTip: `${action?.title} ${
          entityData?.metaData?.LeadRepresentationConfig?.SingularName ?? 'Lead'
        }`
      };
    }
    if (pluralNameList.includes(action?.id)) {
      return {
        ...action,
        title: `${action?.title} ${
          entityData?.metaData?.LeadRepresentationConfig?.PluralName ?? 'Lead'
        }`,
        toolTip: `${action?.title} ${
          entityData?.metaData?.LeadRepresentationConfig?.PluralName ?? 'Lead'
        }`
      };
    }

    return action;
  });
};

export { appendCustomActions, reduceActions, handleDeleteList, getListActions };
