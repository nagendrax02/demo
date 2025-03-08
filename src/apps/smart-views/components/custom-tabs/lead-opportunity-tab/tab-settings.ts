import { trackError } from 'common/utils/experience/utils/track-error';
import {
  IAugmentedTabSettingsDataParams,
  IAvailableColumnConfig,
  IAvailableField,
  IGenerateFilterData
} from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import { getTabData } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { getLeadOppTabMetadata } from './metadata';
import { getEligibleOpportunityFilterConfig } from 'apps/smart-views/augment-tab-data/opportunity/helpers';
import { getFieldsConfig } from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import { TabType } from 'apps/smart-views/constants/constants';
import { getSelectedFields } from 'apps/smart-views/augment-tab-data/common-utilities/tab-settings';
import { DEFAULT_COLUMNS, DEFAULT_FILTERS, LEAD_OPP_SCHEMA_NAMES } from './constants';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { generateFilterData } from 'apps/smart-views/augment-tab-data/opportunity/tab-settings';
import { DEFAULT_COLUMN_CONFIG_MAP } from '../../../augment-tab-data/common-utilities/constant';
import { addActionColumn } from '../../../augment-tab-data/common-utilities/pin-utils';

const customFieldTransformer = (field: IAvailableField): IAvailableField => {
  if (field?.schemaName === LEAD_OPP_SCHEMA_NAMES.OPPORTUNITY_NAME) {
    return { ...field, isDisabled: true, isRemovable: false, isDraggable: false };
  }
  return field;
};

// eslint-disable-next-line max-lines-per-function
const getColumnConfig = async ({
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
    const oppMetaData = await getLeadOppTabMetadata(entityCode || '');

    const repNameMap = {
      [TabType.Opportunity]: oppMetaData?.representationName?.SingularName
    };

    const selectedFields = getSelectedFields({
      augmentEntityMetadata: oppMetaData?.metaDataMap,
      selectedColumns: selectedFieldsSchema || '',
      defaultEntityType: TabType.Opportunity,
      customFieldTransformer,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap
    });

    const oppFields = await getFieldsConfig({
      metaDataMap: oppMetaData?.metaDataMap,
      selectedColumns: selectedFields.map((field) => field.schemaName).join(','),
      maxAllowed: maxAllowed ?? 0,
      entityType: TabType.Opportunity,
      entityCode,
      customFieldTransformer,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: columnConfigMap
    });

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: oppMetaData?.metaDataMap,
      selectedColumns: addActionColumn(DEFAULT_COLUMNS.join(',')),
      defaultEntityType: TabType.Opportunity,
      customFieldTransformer,
      repNameMap: repNameMap,
      selectedAction: selectedHeaderAction,
      columnConfigMap: DEFAULT_COLUMN_CONFIG_MAP.Opportunity,
      featureRestrictionData
    });

    return {
      fields: [
        {
          title: `${oppMetaData?.representationName?.SingularName} Fields`,
          type: TabType.Opportunity,
          data: oppFields
        }
      ],
      selectedFields: selectedFields,
      defaultFields: defaultFields
    };
  } catch (error) {
    trackError(error);
    return {
      fields: [{ title: 'Opportunity Fields', type: TabType.Lead, data: [] }],
      selectedFields: [],
      defaultFields: []
    };
  }
};

const getFilterFields = (
  oppFields: IAvailableField[],
  oppRepName: IEntityRepresentationName
): { title: string; type: TabType; data: IAvailableField[] }[] => {
  return [
    {
      title: `${oppRepName?.SingularName?.toUpperCase()} FIELDS`,
      type: TabType.Opportunity,
      data: oppFields
    }
  ];
};

// eslint-disable-next-line max-lines-per-function
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
    const oppMetadata = await getLeadOppTabMetadata(tabData?.entityCode || '');

    const oppFields = await getFieldsConfig({
      metaDataMap: getEligibleOpportunityFilterConfig(oppMetadata.metaDataMap),
      selectedColumns: selectedFieldsSchema || '',
      maxAllowed: maxAllowed || 0,
      entityType: TabType.Opportunity,
      entityCode: entityCode
    });

    const selectedFields = getSelectedFields({
      augmentEntityMetadata: oppMetadata.metaDataMap,
      selectedColumns: selectedFieldsSchema || '',
      defaultEntityType: TabType.Opportunity
    });

    const defaultFields = getSelectedFields({
      augmentEntityMetadata: oppMetadata.metaDataMap,
      selectedColumns: DEFAULT_FILTERS.join(','),
      defaultEntityType: TabType.Opportunity
    });

    return {
      fields: getFilterFields(oppFields, oppMetadata?.representationName),
      selectedFields,
      defaultFields,
      generateFilterData: (schemaName: string, tabType: TabType, tabEntityCode: string) =>
        generateFilterData({
          metaData: oppMetadata.metaDataMap,
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

const OpportunitySettingsAugmentHandler = {
  getColumnConfig,
  getFilterConfig
};

export { OpportunitySettingsAugmentHandler };
