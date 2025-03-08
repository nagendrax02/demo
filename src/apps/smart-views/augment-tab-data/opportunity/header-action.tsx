import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import {
  HeaderAction,
  HeaderActionType,
  TABS_DEFAULT_ID
} from 'apps/smart-views/constants/constants';
import { IHeaderAction } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { HEADER_ACTION_ID } from '../../components/smartview-tab/components/header/header-actions/constant';
import { getTooltipContent, isSmartviewTab } from '../../utils/utils';
import { workAreaIds } from 'common/utils/process';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IUserPermission } from '../../smartviews.types';
import { IVisibilityConfig } from 'apps/smart-views/utils/entity-action-restriction/entity-action-restriction.types';
import { getVisibilityFromConfig } from 'apps/smart-views/utils/entity-action-restriction/utils/augment-data';
import { EntityActions } from '../../utils/entity-action-restriction/constants';
import { EntityType } from 'common/types';
import ActionIcon from '../../components/more-action';
import Option from 'src/assets/custom-icon/v2/Option';
import styles from 'apps/smart-views/components/more-action/action.module.css';
import { AddOpportunity } from 'src/assets/custom-icon/v2';

const getMoreActionSubMenu = (config: {
  oppPluralRepName: string;
  userPermissions: IUserPermission;
}): IMenuItem[] => {
  const { oppPluralRepName, userPermissions } = config;

  return [
    {
      label: `Import ${oppPluralRepName || 'Opportunities'}`,
      value: HeaderAction.ImportLeads,
      showInWeb: true,
      showInMobile: false,
      disabled: !userPermissions?.import,
      toolTip: getTooltipContent(!userPermissions?.import) || `Import ${oppPluralRepName}`
    },
    {
      label: `Export ${oppPluralRepName || 'Opportunities'}`,
      value: HeaderAction.ExportLeads,
      showInWeb: true,
      showInMobile: false
    }
  ];
};

// eslint-disable-next-line complexity
export const getOpportunityTabActions = ({
  tabId,
  representationName,
  userPermissions,
  leadRepName,
  visibilityConfig
}: {
  tabId: string;
  representationName: IEntityRepresentationName;
  userPermissions: IUserPermission;
  leadRepName?: IEntityRepresentationName;
  visibilityConfig?: IVisibilityConfig;
}): IHeaderAction[] => {
  if (!isSmartviewTab(tabId)) {
    return [];
  }
  const isVisibleAddOpportunity: boolean = visibilityConfig
    ? getVisibilityFromConfig(visibilityConfig, {
        tabId,
        entityType: EntityType.Opportunity,
        action: EntityActions.AddNew
      })
    : true;

  const isVisibleAddNewLead: boolean = getVisibilityFromConfig(visibilityConfig, {
    tabId,
    entityType: EntityType.Opportunity,
    action: EntityActions.AddNewLead
  });

  return [
    ...(isVisibleAddNewLead
      ? [
          {
            title: `Add New ${leadRepName?.SingularName ?? 'Lead'}`,
            actionType: HeaderActionType.SecondaryAction,
            id: HEADER_ACTION_ID.OpportunityAddNewLead,

            value: HEADER_ACTION_ID.OpportunityAddNewLead,
            workAreaConfig: {
              workAreaId: workAreaIds.SMART_VIEWS.OPPORTUNITY_TAB.ADD_LEAD,
              additionalData: tabId,
              fallbackAdditionalData: TABS_DEFAULT_ID
            }
          }
        ]
      : []),
    ...(isVisibleAddOpportunity
      ? [
          {
            id: 'add_opportunity',
            actionType: HeaderActionType.QuickAction,
            title: `Add ${representationName?.SingularName || 'Opportunity'}`,
            workAreaConfig: {
              workAreaId: workAreaIds.SMART_VIEWS.OPPORTUNITY_TAB.ADD_OPPORTUNITY,
              additionalData: tabId,
              fallbackAdditionalData: TABS_DEFAULT_ID
            },
            renderIcon: () => (
              <AddOpportunity
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
      subMenu: getMoreActionSubMenu({
        oppPluralRepName: representationName?.PluralName || '',
        userPermissions
      })?.filter((action) => action?.showInWeb),
      renderIcon: () => (
        <ActionIcon icon={<Option type="outline" className={styles.action_icon} />} />
      )
    }
  ];
};
