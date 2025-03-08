import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import {
  getOpportunityDefaultColumns,
  getOpportunityFieldRenderType,
  getEligibleOpportunityFilterConfig
} from './helpers';
import { GROUPS, SCHEMA_NAMES, TabType } from '../../constants/constants';
import { leadSchemaNamePrefix, OnResetFilters } from './constants';
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
import { fetchLeadMetadataForOpportunity } from './meta-data/lead-metadata';
import { fetchSmartViewOppMetadata } from './meta-data/opportunity-metadata';
import { getTabData } from '../../components/smartview-tab/smartview-tab.store';
import {
  getManageFilterFieldsForNonLeadType,
  getSelectedFields
} from '../common-utilities/tab-settings';
import {
  addAccountColumns,
  filterCustomFieldTransformer,
  getFieldsConfig,
  getStringifiedLeadType
} from '../common-utilities/utils';
import { API_ROUTES } from 'common/constants';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getSettingConfig, settingKeys } from 'common/utils/helpers';
import { removeSchemaPrefix } from '../../components/smartview-tab/utils';
import { DEFAULT_COLUMN_CONFIG_MAP } from '../common-utilities/constant';
import { addActionColumn, filterColumnConfig } from '../common-utilities/pin-utils';

const customFieldTransformer = (field: IAvailableField): IAvailableField | null => {
  if ([SCHEMA_NAMES.OWNER_ID, GROUPS].includes(removeSchemaPrefix(field?.schemaName))) {
    return null;
  }
  return field;
};

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

    const [leadMetadata, oppMetaData, oppNameColumnSetting] = await Promise.all([
      fetchLeadMetadataForOpportunity(tabId ?? ''),
      fetchSmartViewOppMetadata(entityCode || '', CallerSource.SmartViews),
      getSettingConfig<string>(
        settingKeys.enableOppNameColumnCustomization,
        CallerSource.SmartViews
      )
    ]);
    const isOppNameColCustomizationEnabled =
      oppNameColumnSetting === '1' &&
      !tabData?.tabSettings?.canEdit &&
      tabData?.tabSettings?.isOpportunityNameColumnRemoved;

    const defaultColumns = addActionColumn(
      addAccountColumns(systemConfiguredColumns, leadSchemaNamePrefix) ||
        getOpportunityDefaultColumns(oppMetaData?.metaDataMap, isOppNameColCustomizationEnabled)
    );

    const repNameMap = {
      [TabType.Lead]: leadMetadata?.representationName?.SingularName,
      [TabType.Opportunity]: oppMetaData?.representationName?.SingularName
    };

    const selectedFields = getSelectedFields({
      augmentEntityMetadata: { ...leadMetadata?.metaDataMap, ...oppMetaData?.metaDataMap },
      selectedColumns: selectedFieldsSchema ?? '',
      defaultEntityType: TabType.Opportunity,
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
      customFieldTransformer,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap
    });

    const oppFields = await getFieldsConfig({
      metaDataMap: oppMetaData?.metaDataMap,
      selectedColumns: selectedFieldsSchemaName,
      maxAllowed: maxAllowed || 0,
      entityType: TabType.Opportunity,
      entityCode,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap
    });

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: { ...leadMetadata?.metaDataMap, ...oppMetaData?.metaDataMap },
      selectedColumns: defaultColumns,
      defaultEntityType: TabType.Opportunity,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: filterColumnConfig(DEFAULT_COLUMN_CONFIG_MAP.Opportunity, defaultColumns),
      featureRestrictionData
    });

    return {
      fields: [
        {
          title: `${oppMetaData?.representationName?.SingularName} Fields`,
          type: TabType.Opportunity,
          data: oppFields
        },
        {
          title: `${leadMetadata?.representationName?.SingularName} Fields`,
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

export const generateFilterData = async ({
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
  const renderType = getOpportunityFieldRenderType(metaData, schemaName);
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
    label: fieldData?.displayName
  };
};

const getFilterFields = (
  oppFields: IAvailableField[],
  leadFields: IAvailableField[],
  representationNames: {
    leadRepName: IEntityRepresentationName;
    oppRepName: IEntityRepresentationName;
  }
): { title: string; type: TabType; data: IAvailableField[] }[] => {
  return [
    {
      title: `${representationNames?.oppRepName?.SingularName} Fields`,
      type: TabType.Opportunity,
      data: oppFields
    },
    {
      title: `${representationNames?.leadRepName?.SingularName} Fields`,
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
    const [leadMetadata, oppMetadata, salesGroupFilterSetting] = await Promise.all([
      fetchLeadMetadataForOpportunity(tabId ?? ''),
      fetchSmartViewOppMetadata(tabData?.entityCode || '', CallerSource.SmartViews),
      getSettingConfig<string>(settingKeys.ShowSalesGroupFilterForSVOpp, CallerSource.SmartViews)
    ]);
    const isSalesGroupFilterEnabled = salesGroupFilterSetting === '1';
    const customDisallowedFilters = isSalesGroupFilterEnabled ? undefined : { [GROUPS]: 1 };

    const [leadFields, oppFields] = await Promise.all([
      getFieldsConfig({
        metaDataMap: getManageFilterFieldsForNonLeadType(
          leadMetadata?.metaDataMap,
          customDisallowedFilters
        ),
        selectedColumns: selectedFieldsSchema || '',
        maxAllowed: maxAllowed || 0,
        entityType: TabType.Lead,
        customFieldTransformer: filterCustomFieldTransformer
      }),
      getFieldsConfig({
        metaDataMap: getEligibleOpportunityFilterConfig(oppMetadata.metaDataMap),
        selectedColumns: selectedFieldsSchema || '',
        maxAllowed: maxAllowed || 0,
        entityType: TabType.Opportunity,
        entityCode: entityCode,
        customFieldTransformer: filterCustomFieldTransformer
      })
    ]);

    const leadAndOppMetaData = {
      ...leadMetadata?.metaDataMap,
      ...oppMetadata.metaDataMap
    };

    const selectedFields = getSelectedFields({
      augmentEntityMetadata: leadAndOppMetaData,
      selectedColumns: selectedFieldsSchema || '',
      defaultEntityType: TabType.Opportunity
    });

    const getDefaultFilters = (): string[] => {
      return (
        (!isSalesGroupFilterEnabled
          ? OnResetFilters?.filter((schema) => removeSchemaPrefix(schema) !== GROUPS)
          : OnResetFilters) || []
      );
    };

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: leadAndOppMetaData,
      selectedColumns: getDefaultFilters().join(','),
      defaultEntityType: TabType.Opportunity
    });

    return {
      fields: getFilterFields(oppFields, leadFields, {
        leadRepName: leadMetadata?.representationName,
        oppRepName: oppMetadata?.representationName
      }),
      selectedFields,
      defaultFields,
      generateFilterData: (schemaName: string, tabType: TabType, tabEntityCode: string) =>
        generateFilterData({
          metaData: leadAndOppMetaData,
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

const getOpportunityExportConfig = async (
  tabEntityCode: string,
  tabId: string
): Promise<IExportActivityConfig> => {
  const config: IExportActivityConfig = await httpGet({
    path: `${API_ROUTES.opportunityExportConfig}${tabEntityCode}&leadType=${
      (await getStringifiedLeadType(tabId, OptionSeperator.MXSeparator)) ?? ''
    }`,
    module: Module.Marvin,
    callerSource: CallerSource?.SmartViews
  });
  return config;
};

const OpportunitySettingsAugmentHandler = {
  getColumnConfig,
  getFilterConfig
};

export { OpportunitySettingsAugmentHandler, getOpportunityExportConfig };
export type { IAvailableColumnConfig, IAvailableField };
