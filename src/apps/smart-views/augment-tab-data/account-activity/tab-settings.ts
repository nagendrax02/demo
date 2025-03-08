import { trackError } from 'common/utils/experience/utils/track-error';

import { CallerSource } from 'common/utils/rest-client';
import {
  getDefaultColumns,
  getActivityFieldRenderType,
  getEligibleFilterConfig,
  getUnRestrictedFields,
  getAccountMetaDataForFilters,
  canEnableDateTimePicker
} from './helpers';
import { ACCOUNT_SCHEMA_PREFIX, TabType } from '../../constants/constants';
import { ACTIVITY_DEFAULT_FILTERS } from './constants';
import { IFilterData, IOnFilterChange } from '../../components/smartview-tab/smartview-tab.types';
import {
  DATE_FILTER,
  FilterRenderType
} from '../../components/smartview-tab/components/filter-renderer/constants';
import { getFilterMethods } from '../../components/smartview-tab/components/filter-renderer/utils';
import {
  IAugmentedSmartViewEntityMetadata,
  IAugmentedTabSettingsDataParams,
  IAvailableColumnConfig,
  IAvailableField,
  IGenerateFilterData
} from '../common-utilities/common.types';
import { getTabData } from '../../components/smartview-tab/smartview-tab.store';
import { getSelectedFields } from '../common-utilities/tab-settings';
import {
  filterCustomFieldTransformer,
  getActivityFieldsConfig,
  getFieldsConfig
} from '../common-utilities/utils';
import { getAccountMetaData } from './meta-data/accountMetaData';
import { fetchActivityMetadata } from './meta-data/account-activity';
import { isAccountSchemaName } from '../../utils/utils';
import { DEFAULT_COLUMN_CONFIG_MAP } from '../common-utilities/constant';
import { addActionColumn, filterColumnConfig } from '../common-utilities/pin-utils';

// eslint-disable-next-line max-lines-per-function, complexity
const getColumnConfig = async ({
  maxAllowed,
  selectedFieldsSchema,
  entityCode,
  tabId,
  selectedHeaderAction,
  columnConfigMap,
  featureRestrictionData
}: IAugmentedTabSettingsDataParams): Promise<{
  fields: IAvailableColumnConfig[];
  selectedFields: IAvailableField[];
  defaultFields: IAvailableField[];
}> => {
  const tabData = getTabData(tabId || '');
  try {
    const accountMetaData = await getAccountMetaData(tabData.relatedEntityCode || '');

    const repNameMap = {
      [TabType.Account]: accountMetaData.representationName?.SingularName,
      [TabType.Activity]: 'Activity',
      [TabType.AccountActivity]: 'Activity'
    };

    const fields = await getFieldsConfig({
      metaDataMap: accountMetaData?.metaDataMap,
      selectedColumns: selectedFieldsSchema || '',
      maxAllowed: maxAllowed || 0,
      entityType: TabType.Account,
      entityCode: tabData.relatedEntityCode,
      schemaPrefix: ACCOUNT_SCHEMA_PREFIX,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap,
      repNameMap: repNameMap
    });

    const activityMetaData = await fetchActivityMetadata(
      entityCode || '',
      CallerSource?.SmartViews
    );

    const selectedFields = getSelectedFields({
      augmentEntityMetadata: { ...accountMetaData?.metaDataMap, ...activityMetaData?.metaDataMap },
      selectedColumns: selectedFieldsSchema || '',
      defaultEntityType: TabType.AccountActivity,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap,
      featureRestrictionData
    });

    const activityFields = await getActivityFieldsConfig({
      metaDataMap: activityMetaData?.metaDataMap,
      selectedColumns: selectedFields.map((field) => field.schemaName).join(',') || '',
      maxAllowed: maxAllowed || 0,
      entityType: TabType.AccountActivity,
      entityCode,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap
    });

    const accountSectionTitle = `${accountMetaData?.representationName?.SingularName} Fields`;

    const defaultColumns = addActionColumn(
      tabData.tabSettings.getSystemColumns?.() ?? getDefaultColumns()
    );

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: { ...accountMetaData?.metaDataMap, ...activityMetaData?.metaDataMap },
      selectedColumns: defaultColumns,
      defaultEntityType: TabType?.AccountActivity,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: filterColumnConfig(
        DEFAULT_COLUMN_CONFIG_MAP.AccountActivity,
        defaultColumns
      ),
      featureRestrictionData
    });

    return {
      fields: [
        {
          title: 'Activity Fields',
          type: TabType.AccountActivity,
          data: activityFields
        },
        {
          title: accountSectionTitle,
          type: TabType.Account,
          data: fields
        }
      ],
      selectedFields: selectedFields,
      defaultFields: defaultFields
    };
  } catch (error) {
    trackError(error);
    return {
      fields: [
        { title: 'Activity Fields', type: TabType.AccountActivity, data: [] },
        { title: 'Account Fields', type: TabType.AccountActivity, data: [] }
      ],
      selectedFields: [],
      defaultFields: []
    };
  }
};

const generateFilterData = async ({
  entityCode,
  metaData,
  schemaName,
  tabType
}: {
  metaData: Record<string, IAugmentedSmartViewEntityMetadata>;
  schemaName: string;
  tabType: TabType;
  entityCode: string;
}): Promise<IFilterData> => {
  const renderType = getActivityFieldRenderType(metaData, schemaName);
  const fieldData = metaData[schemaName];

  const selectedValue = renderType === FilterRenderType.DateTime ? DATE_FILTER.DEFAULT_OPTION : [];
  const filterValue =
    ((await (
      await getFilterMethods(fieldData?.conditionEntityType)
    )?.getFilterValue?.({
      selectedOption: selectedValue,
      schemaName,
      tabType,
      entityCode
    })) as IOnFilterChange) || {};

  return {
    ...filterValue,
    renderType,
    selectedValue,
    label: fieldData?.displayName,
    enableDateTimePicker: canEnableDateTimePicker(fieldData.renderType, fieldData.dataType),
    entityCode: entityCode
  };
};

const getFilterFields = (
  activityFields: IAvailableField[],
  accountFields: IAvailableField[],
  accountName: string
): { title: string; type: TabType; data: IAvailableField[] }[] => {
  return [
    {
      title: 'Activity Fields',
      type: TabType.AccountActivity,
      data: activityFields
    },

    {
      title: `${accountName || 'Account'} Fields`,

      type: TabType.Account,
      data: accountFields
    }
  ];
};

// eslint-disable-next-line max-lines-per-function, complexity
const getFilterConfig = async ({
  tabId,
  selectedFieldsSchema,
  maxAllowed
}: IAugmentedTabSettingsDataParams): Promise<{
  fields: IAvailableColumnConfig[];
  selectedFields: IAvailableField[];
  defaultFields: IAvailableField[];
  generateFilterData?: IGenerateFilterData;
}> => {
  try {
    const tabData = getTabData(tabId || '');

    const [accountMetaData, activityMetaData] = await Promise.all([
      getAccountMetaData(tabData.relatedEntityCode || ''),
      fetchActivityMetadata(tabData.entityCode || '', CallerSource.SmartViews)
    ]);
    const accountAndActivityMetaData = {
      ...accountMetaData?.metaDataMap,
      ...activityMetaData.metaDataMap
    };

    const selectedFields = getSelectedFields({
      augmentEntityMetadata: accountAndActivityMetaData,
      selectedColumns: selectedFieldsSchema || '',
      defaultEntityType: TabType.AccountActivity
    });

    const [accountFields, activityFields] = await Promise.all([
      getFieldsConfig({
        metaDataMap: getAccountMetaDataForFilters(accountMetaData?.metaDataMap),
        selectedColumns: selectedFieldsSchema || '',
        maxAllowed: maxAllowed || 0,
        entityType: TabType.Account,
        entityCode: tabData.relatedEntityCode,
        schemaPrefix: ACCOUNT_SCHEMA_PREFIX,
        customFieldTransformer: filterCustomFieldTransformer
      }),
      getFieldsConfig({
        metaDataMap: getEligibleFilterConfig(activityMetaData.metaDataMap),
        selectedColumns: selectedFieldsSchema || '',
        maxAllowed: maxAllowed || 0,
        entityType: TabType.AccountActivity,
        customFieldTransformer: filterCustomFieldTransformer
      })
    ]);

    const defaultUnRestrictedFilters = await getUnRestrictedFields(
      ACTIVITY_DEFAULT_FILTERS,
      tabData?.relatedEntityCode || ''
    );

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: accountAndActivityMetaData,
      selectedColumns: defaultUnRestrictedFilters.join(','),
      defaultEntityType: TabType.AccountActivity
    });

    return {
      fields: getFilterFields(
        activityFields,
        accountFields,
        accountMetaData.representationName?.SingularName
      ),
      selectedFields,
      defaultFields,
      generateFilterData: (schemaName: string, tabType: TabType, tabEntityCode: string) =>
        generateFilterData({
          metaData: accountAndActivityMetaData,
          schemaName,
          tabType,
          entityCode: isAccountSchemaName(schemaName)
            ? tabData.relatedEntityCode || tabEntityCode
            : tabData.entityCode || tabEntityCode
        })
    };
  } catch (error) {
    trackError(error);
    return {
      fields: [],
      selectedFields: [],
      defaultFields: []
    };
  }
};

const ActivitySettingsAugmentHandler = {
  getColumnConfig,
  getFilterConfig
};

export { ActivitySettingsAugmentHandler };
export type { IAvailableColumnConfig, IAvailableField };
