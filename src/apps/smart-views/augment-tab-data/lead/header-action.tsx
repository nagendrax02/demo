import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import {
  HeaderAction,
  HeaderActionType,
  TABS_DEFAULT_ID
} from 'apps/smart-views/constants/constants';
import { IHeaderAction } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getTooltipContent, isManageTab, isSmartviewTab } from '../../utils/utils';
import { ILeadTypeConfiguration, IUserPermission } from '../../smartviews.types';
import { TABS_CACHE_KEYS } from '../../components/custom-tabs/constants';
import { workAreaIds } from 'common/utils/process';
import { IVisibilityConfig } from 'apps/smart-views/utils/entity-action-restriction/entity-action-restriction.types';
import { getVisibilityFromConfig } from 'apps/smart-views/utils/entity-action-restriction/utils/augment-data';
import { EntityActions } from '../../utils/entity-action-restriction/constants';
import { EntityType } from 'common/types';
import { isLeadTypeSupportedInManageEntity } from 'common/utils/lead-type/settings';
import ActionIcon from '../../components/more-action';
import { AddLead } from 'assets/custom-icon/v2';
import Option from 'assets/custom-icon/v2/Option';
import styles from 'apps/smart-views/components/more-action/action.module.css';

interface IConfig {
  userPermissions?: IUserPermission;
  visibilityConfig?: IVisibilityConfig;
}

interface IMoreActionMenu {
  repName: IEntityRepresentationName;
  config: IConfig;
  isDefaultLeadTypeTab?: boolean;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
}

const getSingularRepName = (
  leadTypeConfiguration: ILeadTypeConfiguration[] | undefined,
  repName: IEntityRepresentationName
): string => {
  return isLeadTypeSupportedInManageEntity()
    ? leadTypeConfiguration?.[0]?.LeadTypeName ?? repName?.SingularName
    : repName?.SingularName;
};

const getPluralRepName = (
  leadTypeConfiguration: ILeadTypeConfiguration[] | undefined,
  repName: IEntityRepresentationName
): string => {
  return isLeadTypeSupportedInManageEntity()
    ? leadTypeConfiguration?.[0]?.LeadTypeName ?? repName?.PluralName
    : repName?.PluralName;
};

const getImportActionConfig = (
  pluralName: string,
  userPermissions?: IUserPermission,
  isDefaultLeadTypeTab?: boolean
): IMenuItem[] => {
  return isDefaultLeadTypeTab
    ? []
    : [
        {
          label: `Import ${pluralName}`,
          value: HeaderAction.ImportLeads,
          disabled: !userPermissions?.import,
          toolTip: getTooltipContent(!userPermissions?.import) || `Import ${pluralName}`
        }
      ];
};

const getMoreActionSubMenu = ({
  repName,
  config,
  isDefaultLeadTypeTab,
  leadTypeConfiguration
}: IMoreActionMenu): IMenuItem[] => {
  const { userPermissions } = config;

  const pluralName = getPluralRepName(leadTypeConfiguration, repName);

  return [
    ...getImportActionConfig(pluralName, userPermissions, isDefaultLeadTypeTab),
    {
      label: `Export ${pluralName}`,
      value: HeaderAction.ExportLeads
    }
  ];
};

// eslint-disable-next-line complexity
export const getLeadTabActions = ({
  tabId,
  repName,
  userPermissions,
  visibilityConfig,
  isDefaultLeadTypeTab,
  leadTypeConfiguration,
  leadTypeForProcess
}: {
  tabId: string;
  repName: IEntityRepresentationName;
  userPermissions?: IUserPermission;
  visibilityConfig?: IVisibilityConfig;
  isDefaultLeadTypeTab?: boolean;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
  leadTypeForProcess?: string;
}): IHeaderAction[] => {
  // Return default actions if not Smart View or Manage Tab
  if (!isSmartviewTab(tabId) && !isManageTab(tabId)) {
    return [];
  }

  const config: IConfig = {
    userPermissions,
    visibilityConfig
  };

  const isVisibleAddNewLead: boolean = visibilityConfig
    ? getVisibilityFromConfig(visibilityConfig, {
        tabId,
        entityType: EntityType.Lead,
        action: EntityActions.AddNew
      })
    : true;

  const singularName = getSingularRepName(leadTypeConfiguration, repName);

  return [
    ...(getVisibilityFromConfig(visibilityConfig, {
      tabId,
      entityType: EntityType.Lead,
      action: EntityActions.QuickAdd
    })
      ? [
          {
            id: 'quick_add_lead',
            actionType: HeaderActionType.SecondaryAction,
            title: `Quick Add ${getSingularRepName(leadTypeConfiguration, repName)}`,
            workAreaConfig: {
              workAreaId:
                tabId === TABS_CACHE_KEYS.MANAGE_LEADS_TAB
                  ? workAreaIds.MORE_ACTION.MANAGE_LEADS.QUICK_ADD
                  : workAreaIds.MORE_ACTION.LEAD.QUICK_ADD,
              additionalData: isManageTab(tabId) ? `${leadTypeForProcess ?? ''}` : tabId,
              fallbackAdditionalData:
                tabId === TABS_CACHE_KEYS.MANAGE_LEADS_TAB ? '' : TABS_DEFAULT_ID
            }
          }
        ]
      : []),
    ...(isVisibleAddNewLead
      ? [
          {
            title: `Add New ${singularName}`,
            id: HeaderAction.AddNewLead,
            actionType: HeaderActionType.QuickAction,
            workAreaConfig: {
              workAreaId:
                tabId === TABS_CACHE_KEYS.MANAGE_LEADS_TAB
                  ? workAreaIds.MORE_ACTION.MANAGE_LEADS.ADD_NEW
                  : workAreaIds.MORE_ACTION.LEAD.ADD_NEW,
              additionalData:
                tabId === TABS_CACHE_KEYS.MANAGE_LEADS_TAB ? leadTypeForProcess ?? '' : tabId,
              fallbackAdditionalData:
                tabId === TABS_CACHE_KEYS.MANAGE_LEADS_TAB ? '' : TABS_DEFAULT_ID
            },
            renderIcon: () => (
              <AddLead type="outline" className={`${styles.action_icon} ${styles.quick_action}`} />
            )
          }
        ]
      : []),
    {
      id: 'more_actions',
      actionType: HeaderActionType.MoreAction,
      subMenu: getMoreActionSubMenu({
        repName,
        config,
        isDefaultLeadTypeTab,
        leadTypeConfiguration
      }),
      renderIcon: () => (
        <ActionIcon icon={<Option type="outline" className={styles.more_action} />} />
      )
    }
  ];
};
