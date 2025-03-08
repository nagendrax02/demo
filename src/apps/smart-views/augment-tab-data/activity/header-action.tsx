import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import {
  HeaderAction,
  HeaderActionType,
  TABS_DEFAULT_ID
} from 'apps/smart-views/constants/constants';
import { IHeaderAction } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { HEADER_ACTION_ID } from '../../components/smartview-tab/components/header/header-actions/constant';
import { isSmartviewTab } from '../../utils/utils';
import { IVisibilityConfig } from 'apps/smart-views/utils/entity-action-restriction/entity-action-restriction.types';
import { IUserPermission } from '../../smartviews.types';
import { getVisibilityFromConfig } from 'apps/smart-views/utils/entity-action-restriction/utils/augment-data';
import { EntityActions } from '../../utils/entity-action-restriction/constants';
import { EntityType } from 'common/types';
import { activityMetadataGet } from 'common/utils/entity-data-manager/activity/activity';
import { CallerSource } from 'common/utils/rest-client';
import ActionIcon from '../../components/more-action';
import Option from 'src/assets/custom-icon/v2/Option';
import styles from 'apps/smart-views/components/more-action/action.module.css';
import { AddActivity } from 'src/assets/custom-icon/v2';
import { RESTRICT_ADD_ACTIVITY_EVENT_CODES } from './constants';

export interface IConfig {
  userPermissions?: IUserPermission;
  visibilityConfig?: IVisibilityConfig;
}

const getMoreActionSubMenu = (
  tabId: string,
  activityDisplayName: string,
  config: IConfig
): IMenuItem[] => {
  const { visibilityConfig } = config;

  const isVisibleAddNewActivity: boolean = visibilityConfig
    ? getVisibilityFromConfig(visibilityConfig, {
        tabId,
        entityType: EntityType.Activity,
        action: EntityActions.AddNew
      })
    : true;

  return [
    ...(isVisibleAddNewActivity
      ? [
          {
            label: 'Add New Activity',
            value: HEADER_ACTION_ID.AddNewActivity,
            workAreaConfig: {
              workAreaId: 18,
              additionalData: tabId,
              fallbackAdditionalData: TABS_DEFAULT_ID
            },
            showInWeb: false,
            showInMobile: false
          }
        ]
      : []),
    {
      label: 'Import Activities',
      value: HeaderAction.ImportLeads,
      showInWeb: true,
      showInMobile: false
    },
    {
      label: `Export ${activityDisplayName || 'Activities'}`,
      value: HeaderAction.ExportLeads,
      showInWeb: true,
      showInMobile: false
    }
  ];
};

export const getActivityTabActions = async ({
  tabId,
  entityCode,
  visibilityConfig
}: {
  tabId: string;
  entityCode: string;
  visibilityConfig?: IVisibilityConfig;
}): Promise<IHeaderAction[]> => {
  const activityMetaData = await activityMetadataGet(parseInt(entityCode), CallerSource.SmartViews);
  if (!isSmartviewTab(tabId)) {
    return [];
  }
  const isVisibleQuickAddActivity: boolean =
    !RESTRICT_ADD_ACTIVITY_EVENT_CODES[entityCode] &&
    getVisibilityFromConfig(visibilityConfig, {
      tabId,
      entityType: EntityType.Activity,
      action: EntityActions.AddNew
    });

  return [
    ...(isVisibleQuickAddActivity
      ? [
          {
            id: 'quick_add_activity',
            actionType: HeaderActionType.QuickAction,
            title: `Add ${activityMetaData?.DisplayName || 'Activity'}`,
            workAreaConfig: {
              workAreaId: 19,
              additionalData: tabId,
              fallbackAdditionalData: TABS_DEFAULT_ID
            },
            renderIcon: () => (
              <AddActivity
                type="outline"
                className={`${styles.action_icon} ${styles.quick_action}`}
              />
            )
          }
        ]
      : []),
    {
      id: 'more_actions',
      actionType: HeaderActionType.MoreAction,
      subMenu: getMoreActionSubMenu(tabId, activityMetaData?.DisplayName ?? '', {
        visibilityConfig
      })?.filter((action) => action?.showInWeb),
      renderIcon: () => (
        <ActionIcon icon={<Option type="outline" className={styles.action_icon} />} />
      )
    }
  ];
};
