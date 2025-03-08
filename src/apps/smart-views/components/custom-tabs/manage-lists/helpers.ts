import { getCustomActionsFromCache } from 'common/utils/entity-data-manager/lead/custom-actions';
import { IRowActionConfig } from '../../smartview-tab/smartview-tab.types';
import { CallerSource } from 'common/utils/rest-client';
import { EntityType } from 'common/utils/entity-data-manager/common-utils/common.types';
import { IActionConfig } from 'apps/entity-details/types';
import { ISvActionConfig } from 'apps/smart-views/smartviews.types';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';
import {
  staticRowAction,
  DEFAULT_QUICK_ACTIONS,
  STATIC_QUICK_ACTIONS,
  bulkActions
} from './constants';
import { ACTION } from 'apps/entity-details/constants';
import { ICustomActions } from 'common/types/entity/lead/custom-actions.types';
import { IConnectorConfig } from 'common/types/entity/lead';
import { IMenuItem } from '@lsq/nextgen-preact/action-menu/action-menu.types';

// eslint-disable-next-line complexity
const actionsReducer = ({
  item,
  moreActions,
  quickActions
}: {
  item: IActionConfig;
  moreActions: IActionMenuItem[];
  quickActions: IActionConfig[];
}): IActionMenuItem[] => {
  const isActionPresentInQuickActions = quickActions?.find(
    (quickAction) => quickAction?.key === item.key
  );
  if (!isActionPresentInQuickActions) {
    if (item.key) {
      if (DEFAULT_QUICK_ACTIONS.includes(item.key) && quickActions?.length < 3) {
        quickActions.push({
          ...item,
          value: item.key,
          isQuickAction: true,
          label: item.title
        });
      } else {
        moreActions.push({
          ...item,
          label: item.title,
          value: item.key
        });
      }
    }
  }
  return moreActions;
};

// eslint-disable-next-line max-lines-per-function
const appendCustomActions = ({
  customActions,
  moreActions,
  quickActions
}: {
  customActions?: ICustomActions;
  moreActions: IActionMenuItem[];
  actionConfig?: ISvActionConfig;
  quickActions: IActionConfig[];
  isMarvinTab?: boolean;
  tabId?: string;
}): void => {
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
            quickActions,
            moreActions: actionSubmenu
          });
        });
        if (actionSubmenu.length) {
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
              actionHandler: {}
            });
          }
        }
      }
    });
  }
};

export const getQuickActions = (
  quickActions: IActionConfig[],
  customActions: ICustomActions
): void => {
  STATIC_QUICK_ACTIONS.forEach((action) => {
    const isStaticRowAction = staticRowAction?.find((item) => item?.key === action);
    if (isStaticRowAction) {
      quickActions.push(isStaticRowAction);
    } else {
      const smsAction = customActions?.Single?.['Custom Actions']?.find(
        (item) => item?.Id === action
      );
      if (smsAction) {
        quickActions.push({
          id: smsAction?.Id,
          title: smsAction?.Config?.DisplayText,
          toolTip: smsAction?.Config?.DisplayText,
          connectorConfig: smsAction,
          key: smsAction?.Id,
          actionHandler: {}
        });
      }
    }
  });
};

export const getListRowAction = async ({
  tabId,
  isHiddenListSelected
}: {
  tabId: string;
  isHiddenListSelected: boolean;
}): Promise<IRowActionConfig> => {
  const customActions = await getCustomActionsFromCache(CallerSource.ManageLists, EntityType.Lists);

  const quickActions: IActionConfig[] = [];

  getQuickActions(quickActions, customActions);

  let staticRowActions = [...staticRowAction];
  if (isHiddenListSelected) {
    staticRowActions = staticRowActions.filter((item) => item.id !== ACTION.ListHide);
  } else {
    staticRowActions = staticRowActions.filter((item) => item.id !== ACTION.ListUnhide);
  }

  const moreActions = staticRowActions.reduce((acc: IActionMenuItem[], item) => {
    return actionsReducer({
      item,
      moreActions: acc,
      quickActions
    });
  }, []);

  appendCustomActions({
    moreActions,
    customActions,
    quickActions,
    tabId
  });

  return {
    quickActions,
    moreActions
  };
};

export const getListBulkAction = (showHiddenListAction: boolean): IMenuItem[] => {
  if (showHiddenListAction) {
    return bulkActions.filter((action) => action.id !== ACTION.BulkListHide);
  } else {
    return bulkActions.filter((action) => action.id !== ACTION.BulkListUnhide);
  }
};
