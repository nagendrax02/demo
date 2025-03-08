import { trackError } from 'common/utils/experience/utils/track-error';
import {
  ICommonTabSettings,
  ITabResponse,
  IUserPermission,
  ListType
} from 'apps/smart-views/smartviews.types';
import {
  IFetchCriteria,
  IGridConfig,
  IMarvinData,
  ITabConfig
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { fetchUserPermissions } from 'apps/smart-views/augment-tab-data/lead/helpers';
import { getGridConfig } from 'apps/smart-views/augment-tab-data/lead/lead';
import { generateCustomFilters } from 'apps/smart-views/components/smartview-tab/utils';
import { getTabSettings } from 'apps/smart-views/augment-tab-data/common-utilities/tab-settings';
import { workAreaIds } from 'common/utils/process';
import { fetchSmartViewLeadMetadata } from 'apps/smart-views/augment-tab-data/lead/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { DEFAULT_LEAD_REPRESENTATION_NAME } from 'common/component-lib/send-email/constants';
import { TABS_CACHE_KEYS } from '../constants';
import { getScheduledEmailCount, postManageTabCache } from '../utils';
import { IAugmentedSmartViewEntityMetadata } from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import {
  augmentTabData as createRawTabDataToCache,
  fetchProcessData
} from 'apps/smart-views/utils/utils';
import { getSettingConfig, safeParseJson, settingKeys } from 'common/utils/helpers';
import { API_ROUTES } from 'common/constants';
import {
  IActionMenuItem,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { getLeadTypeForManageTabsProcess } from 'apps/smart-views/utils/sv-process';
import {
  filterRemoveFromListActionConfig,
  getCustomActionsFromCache,
  getLeadTypeConfiguration,
  getListDetails,
  getListTitle,
  hideBulkMoreActions,
  updateNonSortableColumn
} from './utils';
import { LIST_TYPES } from './constants';
import { ACTION } from 'apps/entity-details/constants';
import {
  augmentLeadResponse,
  getManageLeadHeaderConfig as getManageListHeaderConfig
} from '../manage-lead-tab/augment';
import { groupByCfsParentName } from '../manage-lead-tab/utils';
import { getListId, getListType } from 'common/utils/helpers/helpers';
import { getListDetailsHeaderActions } from './header-actions';
import { EntityType } from 'common/types';
import { fetchLeadTypeConfig, isLeadTypeEnabled } from 'common/utils/lead-type/settings';
import HeaderLeftControls from './header-left-control';
import RefreshList from './refresh-list';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';

const handleCaching = async (rawTabData: ITabResponse, tabData: ITabConfig): Promise<void> => {
  try {
    const updatedData = createRawTabDataToCache(rawTabData, tabData);
    postManageTabCache(updatedData, getListId() as string);
  } catch (error) {
    trackError(error);
  }
};

const getAugmentedFetchCriteria = (fetchCriteria: IFetchCriteria): IFetchCriteria => {
  fetchCriteria.Columns = groupByCfsParentName(fetchCriteria.Columns);
  return fetchCriteria;
};

const getManageListLeadGridConfig = async ({
  userPermissions,
  commonTabSettings,
  leadMetadata,
  tabData,
  representationName,
  customFilters
}: {
  tabData: ITabResponse;
  customFilters: string;
  commonTabSettings: ICommonTabSettings;
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName?: IEntityRepresentationName;
  userPermissions: IUserPermission;
}): Promise<IGridConfig> => {
  const gridConfig = await getGridConfig({
    tabData,
    entityMetadata: leadMetadata,
    customFilters,
    representationName,
    disableSelection: commonTabSettings?.disableSelection,
    userPermissions
  });

  gridConfig.actions.rowActions.moreActions = gridConfig.actions?.rowActions?.moreActions?.filter(
    (action) => action.id !== ACTION.AddToList
  );
  if (getListType() !== ListType.STATIC.toString()) {
    gridConfig.actions.rowActions.moreActions = filterRemoveFromListActionConfig(
      gridConfig?.actions?.rowActions?.moreActions
    ) as IActionMenuItem[];

    gridConfig.actions.bulkActions = filterRemoveFromListActionConfig(
      gridConfig?.actions?.bulkActions as IMenuItem[]
    );
  }
  gridConfig.actions.bulkActions = hideBulkMoreActions(gridConfig?.actions?.bulkActions);
  gridConfig.augmentFetchCriteria = getAugmentedFetchCriteria;
  gridConfig.augmentResponse = augmentLeadResponse;
  gridConfig.columns = updateNonSortableColumn(gridConfig?.columns);

  return gridConfig;
};

const getListTypes = (): {
  IsRefreshableList: boolean;
  IsStaticList: boolean;
} => {
  const type = getListType();
  return {
    IsRefreshableList: LIST_TYPES[2] == type,
    IsStaticList: LIST_TYPES[0] == type
  };
};

const augmentedMangeListLeadTabData = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;
  const listId = getListId();

  const [
    leadMetaData,
    userPermissions,
    leadTypeNameForProcess,
    listDetails,
    customActions,
    scheduledEmails,
    leadTypeEnabled,
    leadTypeConfig
  ] = await Promise.all([
    fetchSmartViewLeadMetadata(CallerSource.SmartViews, tabData.Id),
    fetchUserPermissions(),
    getLeadTypeForManageTabsProcess(tabData.Id),
    getListDetails(CallerSource.ListDetails),
    getCustomActionsFromCache(CallerSource.ListDetails, EntityType.Lists),
    getScheduledEmailCount({
      listIds: [listId as string],
      callerSource: CallerSource.ListDetails
    }),
    isLeadTypeEnabled(CallerSource.ListDetails),
    fetchLeadTypeConfig(CallerSource.ListDetails),
    getSettingConfig(settingKeys.EnableESSForLeadManagement, CallerSource.ListDetails)
  ]);

  window[`PROCESS_${tabData.Id}`] = fetchProcessData(
    workAreaIds.MANAGE_LEADS,
    TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY,
    leadTypeNameForProcess
  );

  const leadTypeConfiguration = getLeadTypeConfiguration(listDetails, leadTypeConfig);

  const { metaDataMap: leadMetadata, representationName } = leadMetaData;
  const additionalData =
    (safeParseJson(
      tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
    ) as IMarvinData) || {};

  const headerConfig = await getManageListHeaderConfig({
    tabData,
    commonTabSettings,
    leadMetadata,
    allTabIds,
    repName: representationName || {
      SingularName: 'Lead',
      PluralName: 'Leads'
    },
    userPermissions,
    additionalData
  });

  headerConfig.secondary.filterConfig.selectFilterPopupConfig = { removeConfigureFields: true };
  headerConfig.primary.title = getListTitle(listDetails, representationName);
  headerConfig.primary.customTitle = (): JSX.Element => (
    <HeaderLeftControls listDetails={listDetails} />
  );
  headerConfig.primary.onRefreshComponent = ({
    setIsCustomRefreshTriggered
  }: {
    setIsCustomRefreshTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  }): JSX.Element => {
    return (
      <RefreshList
        setIsCustomRefreshTriggered={setIsCustomRefreshTriggered}
        listName={getListTitle(listDetails, representationName) ?? ''}
      />
    );
  };

  headerConfig.secondary.actionConfiguration = getListDetailsHeaderActions({
    representationName,
    customActions,
    listDetails,
    scheduledEmails
  });

  const { selectedFilters, bySchemaName } = headerConfig?.secondary?.filterConfig?.filters || {};
  const customFilters = generateCustomFilters({
    selectedFilters,
    bySchemaName,
    tabType: tabData?.Type,
    entityCode: tabData?.EntityCode,
    leadTypeConfiguration:
      listDetails?.ListType === ListType.DYNAMIC ? leadTypeConfiguration : undefined
  });
  const gridConfig = await getManageListLeadGridConfig({
    commonTabSettings,
    customFilters,
    leadMetadata,
    tabData,
    userPermissions,
    representationName
  });

  gridConfig.apiRoute = API_ROUTES.smartviews.ListLeadGet;
  gridConfig.fetchCriteria = {
    IsStarredList: false,
    ListId: getListId() as string,
    tabId: TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY,
    ...gridConfig?.fetchCriteria,
    ...getListTypes()
  };

  const augmentedData: ITabConfig = {
    id: tabData.Id,
    type: tabData.Type,
    recordCount: tabData.Count,
    entityCode: tabData.EntityCode,
    sharedBy: tabData.SharedBy,
    tabSettings: getTabSettings({
      tabData,
      allTabIds,
      hideEntityCounter: true,
      disableAutoRefresh: LIST_TYPES[2] !== listDetails?.ListType?.toString(),
      isLeadTypeEnabled: leadTypeEnabled
    }),
    headerConfig,
    gridConfig,
    representationName: representationName || DEFAULT_LEAD_REPRESENTATION_NAME,
    isEntityManage: true,
    handleCaching: (newTabData: ITabConfig) => {
      handleCaching(tabData, newTabData);
    },
    leadTypeConfiguration,
    processConfig: {
      leadTypeNameForProcess
    }
  };

  return augmentedData;
};
export { augmentedMangeListLeadTabData };
