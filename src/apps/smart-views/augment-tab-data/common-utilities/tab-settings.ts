import { trackError } from 'common/utils/experience/utils/track-error';
import { IDateOption } from 'common/component-lib/date-filter';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IAuthenticationConfig } from 'common/types';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import {
  DATE_FILTER,
  FilterRenderType,
  OptionSeperator
} from '../../components/smartview-tab/components/filter-renderer/constants';
import { DataType } from 'common/types/entity/lead';
import { GROUPS, SCHEMA_NAMES, TabType } from '../../constants/constants';
import { isAccountSchemaName, isLeadSchema } from '../../utils/utils';
import { IAugmentedSmartViewEntityMetadata, IAvailableField } from './common.types';
import {
  PLATFORM_FILTER_VALUE,
  PLATFORM_FILTER_SELECT_ALL_VALUE,
  nonLeadTabTypeManageFilterConfig,
  ACTION_COLUMN_CONFIG,
  ACTION_COLUMN_SCHEMA_NAME
} from './constant';
import { removeSchemaPrefix } from '../../components/smartview-tab/utils';
import { IGetIsFeatureRestriction, ITabResponse } from '../../smartviews.types';
import {
  IColumnConfigMap,
  IFilter,
  ITabSettings
} from '../../components/smartview-tab/smartview-tab.types';
import { getPinActionConfig } from './pin-utils';

export const getAccountFilterRenderType = (
  metadata: Record<string, IAugmentedSmartViewEntityMetadata>,
  schemaName: string
): FilterRenderType => {
  const fieldMetaData = metadata[schemaName];

  // when dropdown is dependent, it will be rendered as grouped dropdown
  if (fieldMetaData?.parentField) {
    return FilterRenderType.GroupedMSWithoutSelectAll;
  }
  if (fieldMetaData?.dataType === DataType.Date) {
    return FilterRenderType.DateTime;
  }
  if ([DataType.Select, DataType.MultiSelect].includes(fieldMetaData?.dataType as DataType)) {
    return FilterRenderType.MSWithoutSelectAll;
  }
  if (schemaName === SCHEMA_NAMES.OWNER_ID || fieldMetaData?.dataType === DataType.ActiveUsers) {
    return FilterRenderType.UserDropdown;
  }
  return FilterRenderType.None;
};

export const getManageFilterFieldsForNonLeadType = (
  leadMetaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>,
  customDisallowedFilters?: Record<string, number>
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  const filteredMetaData = {};

  const { allowedLeadDataType, canIncludeAsLeadFilter, disallowedLeadFilter } =
    nonLeadTabTypeManageFilterConfig;

  Object.values(leadMetaDataMap)?.map((config) => {
    const { schemaName, dataType, isCFS } = config;
    if (
      isCFS ||
      disallowedLeadFilter[removeSchemaPrefix(schemaName)] ||
      customDisallowedFilters?.[removeSchemaPrefix(schemaName)]
    ) {
      return;
    }

    if (
      allowedLeadDataType?.[dataType || ''] ||
      canIncludeAsLeadFilter[removeSchemaPrefix(schemaName)]
    ) {
      filteredMetaData[schemaName] = config;
    }
  });

  return filteredMetaData;
};

export const getTabSettings = ({
  allTabIds,
  tabData,
  getSystemFilterConfig,
  getSystemColumns,
  disableAutoRefresh,
  disableTabInfo,
  hideEntityCounter,
  isLeadTypeEnabled
}: {
  tabData: ITabResponse;
  allTabIds: string[];
  getSystemFilterConfig?: () => Promise<IFilter>;
  getSystemColumns?: () => string;
  disableAutoRefresh?: boolean;
  disableTabInfo?: boolean;
  hideEntityCounter?: boolean;
  isLeadTypeEnabled?: boolean;
}): ITabSettings => {
  return {
    isSystemTab: tabData?.IsSystemTab,
    allowDelete: tabData?.TabConfiguration?.CanDelete && allTabIds.length > 1,
    canEdit: tabData?.TabConfiguration?.CanEdit,
    getSystemFilterConfig,
    getSystemColumns,
    disableAutoRefresh: disableAutoRefresh,
    disableTabInfo: disableTabInfo,
    hideEntityCounter,
    isLeadTypeEnabled: isLeadTypeEnabled
  };
};

const getFieldTabType = (schema: string, defaultTabType: TabType): TabType => {
  if (isLeadSchema(schema)) return TabType.Lead;
  if (isAccountSchemaName(schema)) return TabType.Account;
  return defaultTabType;
};

interface IGetSelectedField {
  metadata: IAugmentedSmartViewEntityMetadata;
  schemaName: string;
  defaultEntityType: TabType;
  repNameMap?: Record<string, string>;
  selectedAction?: string;
  columnConfigMap?: IColumnConfigMap;
}

const getSelectedField = ({
  metadata,
  schemaName,
  defaultEntityType,
  repNameMap,
  selectedAction,
  columnConfigMap
}: IGetSelectedField): IAvailableField => {
  return {
    ...metadata,
    schemaName: metadata?.schemaName || schemaName,
    id: metadata?.schemaName || schemaName,
    label: metadata?.displayName,
    isRemovable: true,
    isSelected: true,
    type: getFieldTabType(metadata?.schemaName, defaultEntityType),
    badgeText: repNameMap?.[getFieldTabType(metadata?.schemaName, defaultEntityType)],
    ...getPinActionConfig({
      schemaName: metadata?.schemaName || schemaName,
      columnConfigMap,
      selectedAction
    })
  };
};

export const isValidActionColumn = (
  schemaName: string,
  featureRestrictionData?: IGetIsFeatureRestriction
): boolean => {
  if (featureRestrictionData?.isFeatureRestrictedForRowActions) return false;
  return schemaName === ACTION_COLUMN_SCHEMA_NAME;
};

interface IGetSelectedFields {
  augmentEntityMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  selectedColumns: string;
  defaultEntityType: TabType;
  customFieldTransformer?: (field: IAvailableField) => IAvailableField;
  repNameMap?: Record<string, string>;
  selectedAction?: string;
  columnConfigMap?: IColumnConfigMap;
  featureRestrictionData?: IGetIsFeatureRestriction;
}

// eslint-disable-next-line max-lines-per-function
export const getSelectedFields = (config: IGetSelectedFields): IAvailableField[] => {
  const {
    augmentEntityMetadata,
    selectedColumns,
    defaultEntityType,
    customFieldTransformer,
    repNameMap,
    selectedAction,
    columnConfigMap,
    featureRestrictionData
  } = config;

  if (!selectedColumns?.trim()?.length || !augmentEntityMetadata) {
    return [];
  }
  const selectedColumnsArray = selectedColumns?.split(',') || [];
  return selectedColumnsArray
    ?.map((schemaName) => {
      if (isValidActionColumn(schemaName, featureRestrictionData)) {
        return {
          ...ACTION_COLUMN_CONFIG,
          ...getPinActionConfig({
            schemaName: ACTION_COLUMN_SCHEMA_NAME,
            columnConfigMap,
            selectedAction
          })
        };
      } else {
        const metadata = augmentEntityMetadata?.[schemaName];
        const augmentedColumn = getSelectedField({
          metadata,
          schemaName,
          defaultEntityType,
          repNameMap,
          selectedAction,
          columnConfigMap
        });
        return customFieldTransformer ? customFieldTransformer(augmentedColumn) : augmentedColumn;
      }
    })
    ?.filter((selectedColumn) => selectedColumn?.displayName?.trim()?.length);
};

/* Returns options without labels, dropdown components based on RenderType will take care 
   of getting labels for these options */
// eslint-disable-next-line complexity
export const getDefaultFilterValue = (config: {
  renderType: FilterRenderType;
  value: string;
}): IOption[] | IDateOption => {
  const { renderType, value } = config;
  try {
    if (PLATFORM_FILTER_SELECT_ALL_VALUE?.includes(value?.toLowerCase())) return [];
    if (value === PLATFORM_FILTER_VALUE.CURRENT_USER) {
      const { User: currentUser } = (getItem(StorageKey.Auth) || {}) as IAuthenticationConfig;
      return [{ label: '', value: currentUser?.Id }];
    }

    if (value?.split(OptionSeperator.MXSeparator)?.length > 1) {
      const options = value.split(OptionSeperator.MXSeparator);
      return options?.map((option) => ({ label: '', value: option }));
    }
    if (value?.split(OptionSeperator.SemicolonSeparator)?.length > 1) {
      const options = value.split(OptionSeperator.SemicolonSeparator);
      return options?.map((option) => ({ label: '', value: option }));
    }

    if (value?.split(OptionSeperator.CommaSeparator)?.length > 1) {
      const options = value.split(OptionSeperator.CommaSeparator);
      return options?.map((option) => ({ label: '', value: option }));
    }
    if (value) return [{ label: '', value }];
  } catch (error) {
    trackError(error);
  }
  return renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
};

// eslint-disable-next-line complexity
export const getLeadRenderType = (
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
  filter: string
): FilterRenderType => {
  const fieldMetaData = leadMetadata[filter];
  const schemaName = removeSchemaPrefix(filter);

  // when dropdown is dependent, it will be rendered as grouped dropdown
  if (fieldMetaData?.parentField) {
    return FilterRenderType.GroupedMSWithoutSelectAll;
  }
  if (fieldMetaData?.dataType === DataType.Date) {
    return FilterRenderType.DateTime;
  }
  if ([DataType.Select, DataType.MultiSelect].includes(fieldMetaData?.dataType as DataType)) {
    return FilterRenderType.MSWithoutSelectAll;
  }
  if ([SCHEMA_NAMES.CREATED_BY_NAME, SCHEMA_NAMES.OWNER_ID].includes(schemaName)) {
    return FilterRenderType.UserDropdown;
  }
  if ([SCHEMA_NAMES.GROUP, GROUPS, SCHEMA_NAMES.RELATED_COMPANY_ID]?.includes(schemaName)) {
    return FilterRenderType.MSWithoutSelectAll;
  }
  if (schemaName === SCHEMA_NAMES.COMPANY_TYPE_NAME) {
    return FilterRenderType.SearchableSingleSelect;
  }
  return FilterRenderType.None;
};

export const getFilteredAccountMetaData = (
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  const filteredMetaData = {};
  const allowedDataTypes = [DataType.Select, DataType.Date, DataType.MultiSelect];
  const allowedSchemas = [SCHEMA_NAMES.OWNER_ID];

  Object.keys(metaDataMap)?.map((schemaName) => {
    if (
      allowedDataTypes.includes(metaDataMap?.[schemaName]?.dataType as DataType) ||
      allowedSchemas.includes(schemaName)
    ) {
      filteredMetaData[schemaName] = metaDataMap?.[schemaName];
    }
  });

  return filteredMetaData;
};
