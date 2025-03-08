import { getRawTabData } from 'apps/smart-views/smartviews-store';
import { IHeaderAction, ITabConfig, ITabHeader } from '../../smartview-tab/smartview-tab.types';
import { postManageTabCache } from '../utils';
import { trackError } from 'common/utils/experience';
import {
  ICommonTabSettings,
  ILeadTypeConfiguration,
  ITabResponse
} from 'apps/smart-views/smartviews.types';
import {
  getActivityGridConfig,
  getColumnConfig,
  getHeaderConfig
} from 'apps/smart-views/augment-tab-data/activity/activity';
import { MANAGE_ACTIVITY_FEATURE_RESTRICTION_MAP } from './constants';
import { FeatureRestrictionModuleTypes } from 'common/utils/feature-restriction/feature-restriction.types';
import { generateCustomFilters } from '../../smartview-tab/utils';
import { getTabSettings } from 'apps/smart-views/augment-tab-data/common-utilities/tab-settings';
import { augmentTabData as createRawTabDataToCache } from 'apps/smart-views/utils/utils';
import { fetchActivityAndLeadMetaData } from 'apps/smart-views/augment-tab-data/activity/meta-data/combined';
import { fetchUserPermissions } from 'apps/smart-views/augment-tab-data/activity/helpers';
import { EntityType } from '@lsq/nextgen-preact/common/common.types';
import { IVisibilityConfig } from 'apps/smart-views/utils/entity-action-restriction/entity-action-restriction.types';
import { HeaderAction, HeaderActionType } from 'apps/smart-views/constants/constants';
import { getVisibilityFromConfig } from 'apps/smart-views/utils/entity-action-restriction/utils/augment-data';
import { EntityActions } from 'apps/smart-views/utils/entity-action-restriction/constants';
import { HEADER_ACTION_ID } from '../../smartview-tab/components/header/header-actions/constant';
import { workAreaIds } from 'common/utils/process/constant';
import { IWorkAreaConfig } from 'common/utils/process/process.types';
import { CallerSource } from 'common/utils/rest-client';
import { activityMetadataGet } from 'common/utils/entity-data-manager/activity/activity';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IAugmentedSmartViewEntityMetadata } from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import ActionIcon from '../../more-action';
import Option from 'src/assets/custom-icon/v2/Option';
import styles from 'apps/smart-views/components/more-action/action.module.css';
import { AddActivity } from 'src/assets/custom-icon/v2';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { RESTRICT_ADD_ACTIVITY_EVENT_CODES } from 'apps/smart-views/augment-tab-data/activity/constants';

const handleCaching = async (tabData: ITabConfig): Promise<void> => {
  try {
    const rawTabData = getRawTabData(tabData?.id);
    const updatedData = createRawTabDataToCache(rawTabData, tabData);
    postManageTabCache(updatedData, tabData.entityCode);
  } catch (error) {
    trackError(error);
  }
};

const getManageActivityHeaderConfig = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  leadRepName?: IEntityRepresentationName;
}): Promise<ITabHeader> => {
  const { tabData, allTabIds, commonTabSettings, leadTypeConfiguration, metaDataMap, leadRepName } =
    config;
  const headerConfig = await getHeaderConfig({
    tabData,
    allTabIds,
    commonTabSettings,
    metaDataMap,
    leadRepName
  });

  headerConfig.primary.title = leadTypeConfiguration?.length
    ? `Manage ${leadTypeConfiguration?.[0]?.LeadTypeName} Activities`
    : headerConfig.primary.title;
  return headerConfig;
};

const fetchManageActivityProcessData = async (entityCode: string): Promise<void> => {
  try {
    const workAreasIds = [...Object.values(workAreaIds.MANAGE_ACTIVTIES)];
    const workAreaConfig: IWorkAreaConfig[] = workAreasIds.map((workAreaId) => {
      return { workAreaId, additionalData: entityCode };
    });

    const fetchData = (await import('common/utils/process/process'))
      .fetchMultipleWorkAreaProcessForms;
    await fetchData(workAreaConfig, CallerSource.ManageActivities);
  } catch (err) {
    trackError(err);
  }
};

const getMoreActionSubMenu = ({
  activityDisplayName
}: {
  activityDisplayName: string;
}): IMenuItem[] => {
  return [
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

const shouldShowQuickAddActivity = (
  tabId: string,
  entityCode: string,
  visibilityConfig?: IVisibilityConfig
): boolean => {
  return (
    !RESTRICT_ADD_ACTIVITY_EVENT_CODES[entityCode] &&
    getVisibilityFromConfig(visibilityConfig, {
      tabId,
      entityType: EntityType.Activity,
      action: EntityActions.AddNew
    })
  );
};

const shouldShowAddNewLead = (tabId: string, visibilityConfig?: IVisibilityConfig): boolean => {
  return visibilityConfig
    ? getVisibilityFromConfig(visibilityConfig, {
        tabId,
        entityType: EntityType.Activity,
        action: EntityActions.AddNewLead
      })
    : true;
};
export const getManageActivityTabActions = async ({
  tabId,
  entityCode,
  visibilityConfig,
  leadRepName
}: {
  tabId: string;
  entityCode: string;
  visibilityConfig?: IVisibilityConfig;
  leadRepName?: IEntityRepresentationName;
}): Promise<IHeaderAction[]> => {
  const activityMetaData = await activityMetadataGet(
    parseInt(entityCode),
    CallerSource.ManageActivities
  );

  const isVisibleQuickAddActivity = shouldShowQuickAddActivity(tabId, entityCode, visibilityConfig);
  const isVisibleAddNewLead = shouldShowAddNewLead(tabId, visibilityConfig);

  const actions: IHeaderAction[] = [];

  if (isVisibleAddNewLead) {
    actions.push({
      id: HEADER_ACTION_ID.AddNewLead,
      value: HEADER_ACTION_ID.AddNewLead,
      title: `Add New ${leadRepName?.SingularName ?? 'Lead'}`,
      actionType: HeaderActionType.SecondaryAction,
      workAreaConfig: {
        workAreaId: workAreaIds.MANAGE_ACTIVTIES.ADD_LEAD,
        additionalData: entityCode
      }
    });
  }

  if (isVisibleQuickAddActivity) {
    actions.push({
      id: 'quick_add_activity',
      actionType: HeaderActionType.QuickAction,
      title: `Add ${activityMetaData?.DisplayName ?? 'Activity'}`,
      workAreaConfig: {
        workAreaId: workAreaIds.MANAGE_ACTIVTIES.ADD_ACTIVITY,
        additionalData: entityCode
      },
      renderIcon: () => (
        <AddActivity type="outline" className={`${styles.action_icon} ${styles.quick_action}`} />
      )
    });
  }

  actions.push({
    id: 'more_actions',
    actionType: HeaderActionType.MoreAction,
    subMenu: getMoreActionSubMenu({
      activityDisplayName: activityMetaData?.DisplayName ?? ''
    })?.filter((action) => action?.showInWeb),
    renderIcon: () => <ActionIcon icon={<Option type="outline" className={styles.action_icon} />} />
  });

  return actions;
};

const handleManageActivitiesAugmentation = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;
  const [allMetaData, userPermissions] = await Promise.all([
    fetchActivityAndLeadMetaData(tabData?.EntityCode, tabData.Id),
    fetchUserPermissions(tabData.EntityCode)
  ]);
  const { metaDataMap, leadRepName } = allMetaData;

  window[`PROCESS_${tabData.Id}`] = fetchManageActivityProcessData(tabData.EntityCode);

  const headerConfig = await getManageActivityHeaderConfig({
    tabData,
    allTabIds,
    commonTabSettings,
    metaDataMap,
    leadRepName
  });

  if (headerConfig?.secondary) {
    headerConfig.secondary.featureRestrictionConfigMap = MANAGE_ACTIVITY_FEATURE_RESTRICTION_MAP;
    headerConfig.secondary.featureRestrictionModuleName =
      FeatureRestrictionModuleTypes.ManageActivities;
  }

  const { selectedFilters, bySchemaName } = headerConfig?.secondary?.filterConfig?.filters || {};

  const customFilters = generateCustomFilters({
    selectedFilters,
    bySchemaName,
    tabType: tabData?.Type,
    entityCode: tabData?.EntityCode
  });

  const gridConfig = await getActivityGridConfig({
    tabData,
    customFilters,
    selectedColumns: [],
    entityMetadata: metaDataMap,
    representationName: leadRepName,
    filterMap: bySchemaName,
    userPermissions: userPermissions
  });
  const augmentedData: ITabConfig = {
    id: tabData.Id,
    type: tabData.Type,
    recordCount: tabData.Count,
    entityCode: tabData.EntityCode,
    sharedBy: tabData.SharedBy,
    tabSettings: getTabSettings({ tabData, allTabIds }),
    headerConfig,
    gridConfig,
    representationName: { PluralName: 'Activities', SingularName: 'Activity' },
    isEntityManage: true,
    handleCaching: (newTabData: ITabConfig) => {
      handleCaching(newTabData);
    }
  };
  return augmentedData;
};

export default handleManageActivitiesAugmentation;
export { getColumnConfig };
