import { trackError } from 'common/utils/experience/utils/track-error';
import { getColumnConfig } from 'apps/smart-views/augment-tab-data/task';
import {
  ITabConfig,
  ITabHeader,
  TabView
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import {
  ICommonTabSettings,
  ILeadTypeConfiguration,
  ITabResponse
} from 'apps/smart-views/smartviews.types';
import fetchLeadAndTaskMetadata, {
  IAugmentedMetaDataForTasks
} from 'apps/smart-views/augment-tab-data/task/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { getViewInfo } from 'apps/smart-views/augment-tab-data/task/helpers';
import { getHeaderConfig } from 'apps/smart-views/augment-tab-data/task/task';
import { generateCustomFilters } from '../../smartview-tab/utils';
import { getTabSettings } from 'apps/smart-views/augment-tab-data/common-utilities/tab-settings';
import { getGridConfig } from './grid-config';
import { augmentTabData as createRawTabDataToCache } from 'apps/smart-views/utils/utils';
import { postManageTabCache } from '../utils';
import { MANAGE_TASK_FEATURE_RESTRICTION_MAP } from './constants';
import { FeatureRestrictionModuleTypes } from 'common/utils/feature-restriction/feature-restriction.types';
import { getRawTabData } from 'apps/smart-views/smartviews-store';
import { getTaskFilterValueFromAdditionalData } from './utils';
import { getLDTypeConfigFromRawData } from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import { getLeadTypeForManageTabsProcess } from 'apps/smart-views/utils/sv-process';

const handleCaching = async (tabData: ITabConfig): Promise<void> => {
  try {
    const rawTabData = getRawTabData(tabData?.id);
    const updatedData = createRawTabDataToCache(rawTabData, tabData);
    postManageTabCache(updatedData);
  } catch (error) {
    trackError(error);
  }
};

const getManageTaskHeaderConfig = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
  taskRepName: string;
  taskAndLeadMetadata: Record<string, IAugmentedMetaDataForTasks>;
  tabView: TabView;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
}): Promise<ITabHeader> => {
  const {
    tabData,
    allTabIds,
    commonTabSettings,
    taskRepName,
    taskAndLeadMetadata,
    tabView,
    leadTypeConfiguration
  } = config;
  const headerConfig = await getHeaderConfig({
    tabData,
    commonTabSettings,
    allTabIds,
    taskRepName,
    metadata: taskAndLeadMetadata,
    isCalendarView: tabView === TabView.CalendarView
  });

  headerConfig.primary.title = leadTypeConfiguration?.length
    ? `Manage ${leadTypeConfiguration?.[0]?.LeadTypeName} Tasks`
    : headerConfig.primary.title;
  return headerConfig;
};

const handleManageTasksAugmentation = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;
  const { metadata, taskRepName, leadRepName, oppRepName } =
    (await fetchLeadAndTaskMetadata(
      getTaskFilterValueFromAdditionalData(tabData) || tabData?.EntityCode,
      CallerSource.ManageTasks,
      tabData.Id
    )) || {};
  const taskAndLeadMetadata = { ...metadata?.leadMetadata, ...metadata?.taskMetadata };
  const { tabView, calendarView } = getViewInfo(tabData);
  const [leadTypeConfiguration, leadTypeInternalNamesForProcess] = await Promise.all([
    getLDTypeConfigFromRawData(tabData.Id),
    getLeadTypeForManageTabsProcess(tabData.Id)
  ]);

  const headerConfig = await getManageTaskHeaderConfig({
    tabData,
    allTabIds,
    commonTabSettings,
    tabView,
    taskAndLeadMetadata,
    taskRepName,
    leadTypeConfiguration
  });

  if (headerConfig?.secondary) {
    headerConfig.secondary.featureRestrictionConfigMap = MANAGE_TASK_FEATURE_RESTRICTION_MAP;
    headerConfig.secondary.featureRestrictionModuleName = FeatureRestrictionModuleTypes.ManageTasks;
  }

  const { selectedFilters, bySchemaName } = headerConfig?.secondary?.filterConfig?.filters || {};

  const customFilters = generateCustomFilters({
    selectedFilters,
    bySchemaName,
    tabType: tabData?.Type,
    entityCode: tabData?.EntityCode,
    leadTypeConfiguration
  });

  const gridConfig = await getGridConfig({
    tabData,
    metadata: taskAndLeadMetadata,
    customFilters,
    filterMap: bySchemaName,
    leadRepName,
    oppRepName,
    leadTypeInternalNamesForProcess
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
    representationName: { PluralName: 'Tasks', SingularName: taskRepName || 'Task' },
    tabView,
    calendarView,
    isEntityManage: true,
    handleCaching: (newTabData: ITabConfig) => {
      handleCaching(newTabData);
    },
    leadTypeConfiguration,
    processConfig: { leadTypeNameForProcess: leadTypeInternalNamesForProcess }
  };

  return augmentedData;
};

export default handleManageTasksAugmentation;
export { getColumnConfig };
