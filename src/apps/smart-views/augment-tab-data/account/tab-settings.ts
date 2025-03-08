import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { getUnRestrictedFields } from './helpers';
import { SCHEMA_NAMES, TabType } from '../../constants/constants';
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
import {
  getAccountFilterRenderType,
  getFilteredAccountMetaData,
  getSelectedFields
} from '../common-utilities/tab-settings';
import { filterCustomFieldTransformer, getFieldsConfig } from '../common-utilities/utils';
import { DefaultAccountRepName, OnResetColumns, OnResetFilters } from './constants';
import { fetchRepresentationName } from 'common/utils/entity-data-manager/account/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { fetchSmartViewAccountMetadata } from '../common-utilities/meta-data/account-meta-data';
import { DEFAULT_COLUMN_CONFIG_MAP } from '../common-utilities/constant';
import { addActionColumn, filterColumnConfig } from '../common-utilities/pin-utils';

const customFieldTransformer = (field: IAvailableField): IAvailableField | null => {
  if (field?.schemaName === SCHEMA_NAMES.OWNER_ID) {
    return null;
  }
  return field;
};

const getColumnConfig = async ({
  tabId = '',
  maxAllowed,
  selectedFieldsSchema,
  entityCode,
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
    const systemConfiguredColumns = tabData.tabSettings
      .getSystemColumns?.()
      ?.replaceAll('CheckBoxColumn,', '')
      ?.replaceAll('Actions,', '')
      ?.replaceAll('ExpandCollapse,', '');

    const { metaDataMap } = await fetchSmartViewAccountMetadata(entityCode || '');
    const representationName =
      (await fetchRepresentationName(CallerSource.SmartViews, entityCode || '')) ||
      DefaultAccountRepName;

    const selectedFields = getSelectedFields({
      augmentEntityMetadata: { ...metaDataMap },
      selectedColumns: selectedFieldsSchema || '',
      defaultEntityType: TabType.Account,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap,
      featureRestrictionData
    });

    const accountFields = await getFieldsConfig({
      metaDataMap,
      selectedColumns: selectedFields.map((field) => field.schemaName).join(','),
      maxAllowed: maxAllowed ?? 0,
      entityType: TabType.Account,
      entityCode,
      customFieldTransformer,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap
    });

    const defaultColumns = addActionColumn(systemConfiguredColumns ?? OnResetColumns.join(','));

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: { ...metaDataMap },
      selectedColumns: defaultColumns,
      defaultEntityType: TabType.Account,
      selectedAction: selectedHeaderAction,
      columnConfigMap: filterColumnConfig(DEFAULT_COLUMN_CONFIG_MAP.Account, defaultColumns),
      featureRestrictionData
    });

    return {
      fields: [
        {
          title: `${representationName?.SingularName || 'Account'} Fields`,
          type: TabType.Account,
          data: accountFields
        }
      ],
      selectedFields: selectedFields,
      defaultFields: defaultFields
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
  const renderType = getAccountFilterRenderType(metaData, schemaName);
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
  fields: IAvailableField[],
  representationName: IEntityRepresentationName
): { title: string; type: TabType; data: IAvailableField[] }[] => {
  return [
    {
      title: `${representationName?.SingularName?.toUpperCase() || 'Account'} Fields`,
      type: TabType.Account,
      data: fields
    }
  ];
};

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
    const { metaDataMap } = await fetchSmartViewAccountMetadata(tabData?.entityCode || '');
    const representationName =
      (await fetchRepresentationName(CallerSource.SmartViews, tabData?.entityCode || '')) ||
      DefaultAccountRepName;
    const filteredAccountMetaData = getFilteredAccountMetaData(metaDataMap);

    const accountFields = await getFieldsConfig({
      metaDataMap: filteredAccountMetaData,
      selectedColumns: selectedFieldsSchema || '',
      maxAllowed: maxAllowed || 0,
      entityType: TabType.Account,
      entityCode: tabData?.entityCode,
      customFieldTransformer: filterCustomFieldTransformer
    });
    const selectedFields = getSelectedFields({
      augmentEntityMetadata: metaDataMap,
      selectedColumns: selectedFieldsSchema || '',
      defaultEntityType: TabType.Account
    });

    const defaultUnRestrictedFilters = await getUnRestrictedFields(
      OnResetFilters,
      tabData?.entityCode || ''
    );

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: metaDataMap,
      selectedColumns: defaultUnRestrictedFilters.join(','),
      defaultEntityType: TabType.Account
    });

    return {
      fields: getFilterFields(accountFields, representationName),
      selectedFields,
      defaultFields,
      generateFilterData: (schemaName: string, tabType: TabType, entityCode: string) =>
        generateFilterData({ metaData: metaDataMap, schemaName, tabType, entityCode })
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

const AccountSettingsAugmentHandler = {
  getColumnConfig,
  getFilterConfig
};

export { AccountSettingsAugmentHandler };
export type { IAvailableColumnConfig, IAvailableField };
