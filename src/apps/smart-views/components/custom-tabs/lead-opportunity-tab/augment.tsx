import { trackError } from 'common/utils/experience/utils/track-error';
import { ICommonTabSettings, ITabResponse } from 'apps/smart-views/smartviews.types';
import {
  IFilterConfig,
  IMarvinData,
  IOnFilterChange,
  ISecondaryHeader,
  ITabConfig,
  ITabHeader
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import {
  fetchUserPermissions,
  getInitialFilterSelectedValue,
  getOpportunityFieldRenderType
} from 'apps/smart-views/augment-tab-data/opportunity/helpers';
import { getColumnConfig } from 'apps/smart-views/augment-tab-data/opportunity/opportunity';
import { generateCustomFilters } from 'apps/smart-views/components/smartview-tab/utils';
import { getTabSettings } from 'apps/smart-views/augment-tab-data/common-utilities/tab-settings';
import { getLeadOppTabMetadata } from './metadata';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import {
  ANY_OPPORTUNITY,
  DEFAULT_FILTERS,
  DEFAULT_OPP_TYPE_FILTER_CONFIG,
  DEFAULT_OPP_TYPE_OPTION,
  LEAD_OPP_TAB_HEADER_ACTION_FEATURE_RESTRICTION_MAP,
  LEAD_OPP_SCHEMA_NAMES
} from './constants';
import { IAugmentedSmartViewEntityMetadata } from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import { FilterRenderType } from 'apps/smart-views/components/smartview-tab/components/filter-renderer/constants';
import { getFilterMethods } from 'apps/smart-views/components/smartview-tab/components/filter-renderer/utils';
import { DataType } from 'common/types/entity/lead';
import { fetchDefaultStatusOptions, fetchOppTypeOptions } from './fetch-options';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { setFilterDataForSchema } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { augmentationOnManageFilterSave, getFilterDisableConfig } from './utils';
import { getRestrictionMap } from 'common/utils/permission-manager/permission-manager';
import { ActionType, PermissionEntityType } from 'common/utils/permission-manager';
import { CallerSource } from 'common/utils/rest-client';
import { safeParseJson } from 'common/utils/helpers';
import { getGridConfig } from './augmentation-utils/grid-config';
import { getOpportunityRepName } from 'apps/smart-views/utils/utils';

const addOppTypeFilter = async (
  filterData: IFilterConfig,
  tabData: ITabResponse
): Promise<void> => {
  const representationName = await getOpportunityRepName();
  const label = DEFAULT_OPP_TYPE_FILTER_CONFIG.label?.replace(
    'Opportunity',
    representationName?.SingularName
  );

  filterData[LEAD_OPP_SCHEMA_NAMES.OPPORTUNITY_TYPE] = {
    ...DEFAULT_OPP_TYPE_FILTER_CONFIG,
    label,
    customCallbacks: {
      fetchOptions: fetchOppTypeOptions,
      onChange: (option: IOption[]): IOnFilterChange | null => {
        const augmentedOption = option?.length ? option : [DEFAULT_OPP_TYPE_OPTION];
        setFilterDataForSchema(
          tabData?.Id,
          {
            ...filterData[LEAD_OPP_SCHEMA_NAMES.OPPORTUNITY_TYPE],
            selectedValue: augmentedOption,
            value: augmentedOption?.[0]?.value
          },
          LEAD_OPP_SCHEMA_NAMES.OPPORTUNITY_TYPE
        );
        return null;
      }
    },
    selectedValue: [{ label: '', value: tabData?.EntityCode }],
    value: tabData?.EntityCode,
    isNotCounted: true,
    isNonClearable: true,
    isPinned: true,
    disablePinAction: true,
    disablePinActionTooltip: 'The opportunity type filter cannot be unpinned.'
  };
};

const addStatusFetchOptionsForAnyOpp = (tabData: ITabResponse, filterData: IFilterConfig): void => {
  const statusFilterData = filterData[LEAD_OPP_SCHEMA_NAMES.STATUS];
  if (tabData?.EntityCode === ANY_OPPORTUNITY && statusFilterData) {
    filterData[LEAD_OPP_SCHEMA_NAMES.STATUS] = {
      ...statusFilterData,
      customCallbacks: {
        fetchOptions: fetchDefaultStatusOptions
      }
    };
  }
};

const generateInitialFilterData = async (config: {
  defaultFilterArray: string[];
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  tabData: ITabResponse;
}): Promise<IFilterConfig> => {
  const { defaultFilterArray, tabData, metaDataMap } = config;
  const filterData: IFilterConfig = {};
  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;

  const filterValues = additionalData?.Marvin?.FilterValues || {};

  await Promise.all(
    defaultFilterArray?.map(async (filter) => {
      try {
        const renderType = getOpportunityFieldRenderType(metaDataMap, filter);
        if (renderType === FilterRenderType.None) return;
        const filterMetaData = metaDataMap[filter];
        const selectedValue = getInitialFilterSelectedValue({
          schema: filter,
          filterValues: filterValues,
          renderType,
          additionalData: {},
          parsedFilters: {},
          metadataMap: metaDataMap
        });

        if (!filterMetaData) return;
        const filterValue =
          ((await (
            await getFilterMethods(filterMetaData?.conditionEntityType)
          )?.getFilterValue?.({
            selectedOption: selectedValue,
            schemaName: filter,
            tabType: tabData?.Type,
            entityCode: tabData?.EntityCode
          })) as IOnFilterChange) || {};

        const { isDisabled, isDisabledTooltip } = getFilterDisableConfig(
          tabData?.EntityCode,
          filter
        );

        filterData[filter] = {
          ...filterValue,
          label: metaDataMap[filter]?.displayName,
          dataType: metaDataMap[filter]?.dataType as DataType,
          selectedValue: selectedValue,
          renderType,
          isDisabled: isDisabled,
          isDisabledTooltip: isDisabledTooltip,
          isPinned: filterValues?.[filter]?.isPinned
        };

        addStatusFetchOptionsForAnyOpp(tabData, filterData);
      } catch (error) {
        trackError(error);
      }
    })
  );

  // ordering based on default filters as promise.all executes all promises parallely and filterData is getting jumbled up
  const orderedFilterData = {};
  defaultFilterArray?.forEach((schema) => (orderedFilterData[schema] = filterData[schema]));
  await addOppTypeFilter(orderedFilterData, tabData);
  return orderedFilterData;
};

const getUnRestrictedFields = async (
  defaultFilters: string[],
  entityCode: string
): Promise<string[]> => {
  const oppRestriction = await getRestrictionMap(defaultFilters, {
    entity: PermissionEntityType.Opportunity,
    action: ActionType.View,
    entityId: entityCode,
    callerSource: CallerSource.LeadDetails
  });

  return defaultFilters?.filter((filter) => !oppRestriction[filter]);
};

const getHeaderConfig = async ({
  tabData,
  metaDataMap
}: {
  tabData: ITabResponse;
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
}): Promise<ITabHeader> => {
  const primaryHeader = {
    canHide: true,
    title: tabData.TabConfiguration.Title,
    description: tabData.TabConfiguration.Description,
    advancedSearchEnglish: '',
    modifiedByName: tabData.ModifiedByName,
    modifiedOn: tabData.ModifiedOn,
    autoRefreshTime: 0
  };

  const additionalData = safeParseJson(
    tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData
  ) as IMarvinData;

  const selectedFilters = additionalData?.Marvin?.Exists
    ? Object.keys(additionalData?.Marvin?.FilterValues || {})
    : DEFAULT_FILTERS;

  let selectedFilterArray = [
    LEAD_OPP_SCHEMA_NAMES.OPPORTUNITY_TYPE,
    ...(await getUnRestrictedFields(selectedFilters, tabData?.EntityCode))
  ];

  selectedFilterArray = Array.from(new Set(selectedFilterArray?.filter((filter) => filter)));

  const secondaryHeader: ISecondaryHeader = {
    searchText: '',
    filterConfig: {
      filters: {
        selectedFilters: selectedFilterArray,
        bySchemaName: await generateInitialFilterData({
          defaultFilterArray: selectedFilterArray,
          tabData,
          metaDataMap
        }),
        augmentationOnManageFilterSave
      },
      maxAllowedFilters: 10,
      selectFilterPopupConfig: {
        removeConfigureFields: tabData.EntityCode === ANY_OPPORTUNITY
      }
    },
    actionConfiguration: [],
    featureRestrictionConfigMap: LEAD_OPP_TAB_HEADER_ACTION_FEATURE_RESTRICTION_MAP
  };

  return {
    primary: primaryHeader,
    secondary: secondaryHeader
  };
};

const handleAugmentation = async (config: {
  tabData: ITabResponse;
  allTabIds: string[];
  commonTabSettings: ICommonTabSettings;
}): Promise<ITabConfig> => {
  const { tabData, allTabIds, commonTabSettings } = config;
  const [allMetaData, userPermissions] = await Promise.all([
    getLeadOppTabMetadata(tabData?.EntityCode),
    fetchUserPermissions(tabData?.EntityCode)
  ]);

  const { metaDataMap, representationName } = allMetaData;
  const headerConfig = await getHeaderConfig({ tabData, metaDataMap });

  const { selectedFilters, bySchemaName } = headerConfig?.secondary?.filterConfig?.filters || {};
  const customFilters = generateCustomFilters({
    selectedFilters,
    bySchemaName,
    tabType: tabData?.Type,
    entityCode: tabData?.EntityCode
  });
  const gridConfig = await getGridConfig({
    tabData,
    customFilters,
    commonTabSettings,
    entityMetadata: metaDataMap,
    representationName: DEFAULT_ENTITY_REP_NAMES.lead,
    filterMap: bySchemaName,
    userPermissions
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
    representationName: representationName
  };

  return augmentedData;
};

export default handleAugmentation;
export { getColumnConfig };
