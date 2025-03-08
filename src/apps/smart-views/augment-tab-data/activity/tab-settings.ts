import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import {
  canEnableDateTimePickerInDateFilter,
  getActivityDefaultColumns,
  getActivityFieldRenderType,
  getEligibleActivityFilterConfig,
  getUnRestrictedFields,
  handleDefaultFilterForSalesActivity
} from './helpers';
import { TabType } from '../../constants/constants';
import { ACTIVITY_DEFAULT_FILTERS_WITH_DATE, leadSchemaNamePrefix } from './constants';
import {
  IExportActivityConfig,
  IFilterData,
  IOnFilterChange
} from '../../components/smartview-tab/smartview-tab.types';
import {
  DATE_FILTER,
  FilterRenderType,
  OptionSeperator
} from '../../components/smartview-tab/components/filter-renderer/constants';
import { getFilterMethods } from '../../components/smartview-tab/components/filter-renderer/utils';
import {
  IAugmentedSmartViewEntityMetadata,
  IAugmentedTabSettingsDataParams,
  IAvailableColumnConfig,
  IAvailableField,
  IGenerateFilterData
} from '../common-utilities/common.types';
import { fetchLeadMetadataForActivity } from './meta-data/lead-metadata';
import { fetchSmartViewActivityMetadata } from './meta-data/activity-metadata';
import { getTabData } from '../../components/smartview-tab/smartview-tab.store';
import {
  getManageFilterFieldsForNonLeadType,
  getSelectedFields
} from '../common-utilities/tab-settings';
import {
  getActivityFieldsConfig,
  getFieldsConfig,
  replaceWithLeadRepresentationName,
  getStringifiedLeadType,
  filterCustomFieldTransformer,
  addAccountColumns
} from '../common-utilities/utils';
import { API_ROUTES } from 'common/constants';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { DEFAULT_COLUMN_CONFIG_MAP } from '../common-utilities/constant';
import { addActionColumn } from '../common-utilities/pin-utils';
import { DataType } from 'common/types/entity/lead/metadata.types';

const getColumnConfig = async ({
  maxAllowed,
  selectedFieldsSchema,
  entityCode,
  tabId = '',
  selectedHeaderAction,
  columnConfigMap,
  featureRestrictionData
}: IAugmentedTabSettingsDataParams): Promise<{
  fields: IAvailableColumnConfig[];
  selectedFields: IAvailableField[];
  defaultFields: IAvailableField[];
}> => {
  try {
    const tabData = getTabData(tabId);
    const systemConfiguredColumns = tabData.tabSettings.getSystemColumns?.()?.split(',') || [];
    const leadMetadata = await fetchLeadMetadataForActivity(tabId ?? '');
    const activityMetaData = await fetchSmartViewActivityMetadata(
      entityCode ?? '',
      CallerSource?.SmartViews
    );
    const repNameMap = {
      [TabType.Lead]: leadMetadata?.representationName?.SingularName,
      [TabType.Activity]: 'Activity'
    };

    const selectedFields = getSelectedFields({
      augmentEntityMetadata: { ...leadMetadata?.metaDataMap, ...activityMetaData?.metaDataMap },
      selectedColumns: selectedFieldsSchema ?? '',
      defaultEntityType: TabType.Activity,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap,
      featureRestrictionData
    });
    const selectedFieldsSchemaName =
      selectedFields.map((field) => field.schemaName).join(',') || '';
    const fields = await getFieldsConfig({
      metaDataMap: leadMetadata?.metaDataMap,
      selectedColumns: selectedFieldsSchemaName,
      maxAllowed: maxAllowed || 0,
      entityType: TabType.Lead,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap
    });

    const activityFields = await getActivityFieldsConfig({
      metaDataMap: activityMetaData?.metaDataMap,
      selectedColumns: selectedFieldsSchemaName,
      maxAllowed: maxAllowed || 0,
      entityType: TabType.Activity,
      entityCode,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap
    });

    const title = replaceWithLeadRepresentationName(
      'Lead Fields',
      leadMetadata?.representationName?.SingularName
    );

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: { ...leadMetadata?.metaDataMap, ...activityMetaData?.metaDataMap },
      selectedColumns: addActionColumn(
        addAccountColumns(systemConfiguredColumns, leadSchemaNamePrefix) ||
          getActivityDefaultColumns(entityCode)?.replaceAll('CheckBoxColumn,', '')
      ),
      defaultEntityType: TabType?.Activity,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: DEFAULT_COLUMN_CONFIG_MAP.Activity,
      featureRestrictionData
    });

    return {
      fields: [
        {
          title: 'Activity Fields',
          type: TabType.Activity,
          data: activityFields
        },
        {
          title: title,
          type: TabType.Lead,
          data: fields
        }
      ],
      selectedFields: selectedFields,
      defaultFields: defaultFields
    };
  } catch (error) {
    trackError(error);
    return {
      fields: [{ title: 'Lead Fields', type: TabType.Lead, data: [] }],
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
    dataType: metaData[schemaName]?.dataType as DataType,
    enableDateTimePicker: canEnableDateTimePickerInDateFilter(
      renderType,
      fieldData?.dataType,
      fieldData?.conditionEntityType
    )
  };
};

const getFilterFields = (
  activityFields: IAvailableField[],
  leadFields: IAvailableField[],
  leadRepName: IEntityRepresentationName
): { title: string; type: TabType; data: IAvailableField[] }[] => {
  return [
    {
      title: 'Activity Fields',
      type: TabType.Activity,
      data: activityFields
    },

    {
      title: replaceWithLeadRepresentationName('Lead Fields', leadRepName?.SingularName),
      type: TabType.Lead,
      data: leadFields
    }
  ];
};

const getFilterConfig = async ({
  tabId,
  selectedFieldsSchema,
  maxAllowed,
  entityCode
}: IAugmentedTabSettingsDataParams): Promise<{
  fields: IAvailableColumnConfig[];
  selectedFields: IAvailableField[];
  defaultFields: IAvailableField[];
  generateFilterData?: IGenerateFilterData;
}> => {
  try {
    const tabData = getTabData(tabId || '');
    const [leadMetadata, activityMetaData] = await Promise.all([
      fetchLeadMetadataForActivity(tabId ?? ''),
      fetchSmartViewActivityMetadata(tabData?.entityCode || '', CallerSource.SmartViews)
    ]);

    const [leadFields, activityFields] = await Promise.all([
      getFieldsConfig({
        metaDataMap: getManageFilterFieldsForNonLeadType(leadMetadata?.metaDataMap),
        selectedColumns: selectedFieldsSchema || '',
        maxAllowed: maxAllowed || 0,
        entityType: TabType.Lead,
        customFieldTransformer: filterCustomFieldTransformer
      }),
      getFieldsConfig({
        metaDataMap: getEligibleActivityFilterConfig(activityMetaData.metaDataMap),
        selectedColumns: selectedFieldsSchema || '',
        maxAllowed: maxAllowed || 0,
        entityType: TabType.Activity,
        entityCode: entityCode,
        customFieldTransformer: filterCustomFieldTransformer
      })
    ]);

    const leadAndActivityMetaData = {
      ...leadMetadata?.metaDataMap,
      ...activityMetaData.metaDataMap
    };

    const selectedFields = getSelectedFields({
      augmentEntityMetadata: leadAndActivityMetaData,
      selectedColumns: selectedFieldsSchema || '',
      defaultEntityType: TabType.Activity
    });

    const defaultFilterArray = handleDefaultFilterForSalesActivity(
      ACTIVITY_DEFAULT_FILTERS_WITH_DATE.join(',') || '',
      tabData?.entityCode || '',
      activityMetaData?.metaDataMap
    ).split(',');

    const defaultUnRestrictedFilters = await getUnRestrictedFields(
      defaultFilterArray,
      tabData?.entityCode || ''
    );

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: leadAndActivityMetaData,
      selectedColumns: defaultUnRestrictedFilters.join(','),
      defaultEntityType: TabType.Activity
    });

    return {
      fields: getFilterFields(activityFields, leadFields, leadMetadata.representationName),
      selectedFields,
      defaultFields,
      generateFilterData: (schemaName: string, tabType: TabType, tabEntityCode: string) =>
        generateFilterData({
          metaData: leadAndActivityMetaData,
          schemaName,
          tabType,
          entityCode: tabEntityCode
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

const getActivityExportConfig = async (
  tabEntityCode: string,
  tabId: string
): Promise<IExportActivityConfig> => {
  const config: IExportActivityConfig = await httpGet({
    path: `${API_ROUTES.activityExportConfig}${tabEntityCode}&leadType=${
      (await getStringifiedLeadType(tabId, OptionSeperator.MXSeparator)) ?? ''
    }`,
    module: Module.Marvin,
    callerSource: CallerSource?.SmartViews
  });
  return config;
};

const ActivitySettingsAugmentHandler = {
  getColumnConfig,
  getFilterConfig
};

export { ActivitySettingsAugmentHandler, getActivityExportConfig };
export type { IAvailableColumnConfig, IAvailableField };
