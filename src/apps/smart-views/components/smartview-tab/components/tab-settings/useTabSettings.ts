import { ITabSettingsConfig, TAB_SETTING_CONFIG } from './config';
import { useEffect, useState } from 'react';
import { TabType } from 'apps/smart-views/constants/constants';
import {
  IAvailableColumnConfig,
  IAvailableField
} from 'apps/smart-views/augment-tab-data/lead/tab-settings';
import getSVAugmenter, { ITabAugmenter } from 'apps/smart-views/augment-tab-data';
import { useTabSettingsActions } from './tab-settings.store';
import {
  IAugmentedSmartViewEntityMetadata,
  IGenerateFilterData
} from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';
import { getStandaloneSVAugmenter } from 'apps/smart-views/components/custom-tabs';
import { IColumnConfigMap } from '../../smartview-tab.types';
import { IGetIsFeatureRestriction } from 'apps/smart-views/smartviews.types';

interface IUseTabSettings {
  tabConfig: ITabSettingsConfig | null;
  fieldConfig: IAvailableColumnConfig[];
  selectedFields: IAugmentedSmartViewEntityMetadata[];
  defaultFields: IAvailableField[];
  resetNormalization: (commaSeparatedFieldSchemas: string) => Promise<void>;
  generateFilterData?: IGenerateFilterData;
}

interface IUseTabSettingsData {
  selectedTabType: string;
  tabType: TabType;
  selectedFields: string;
  maxAllowed: number;
  tabId: string;
  entityCode?: string;
  additionalEntityColumns?: string;
  columnConfigMap?: IColumnConfigMap;
  featureRestrictionData?: IGetIsFeatureRestriction;
}

// eslint-disable-next-line max-lines-per-function
const useTabSettings = (data: IUseTabSettingsData): IUseTabSettings | null => {
  const {
    selectedTabType,
    tabType,
    selectedFields,
    maxAllowed,
    entityCode,
    tabId,
    additionalEntityColumns,
    columnConfigMap,
    featureRestrictionData
  } = data;
  const [normalizedData, setNormalizedData] = useState<IUseTabSettings | null>(null);
  const { setFields, setSelectedFields, setMaxAllowedSelection } = useTabSettingsActions();

  const getDefaultFields = (fields?: IAvailableField[]): IAvailableField[] => {
    return fields || [];
  };

  const handleAdditionalEntityColumns = (
    entityFields: IAvailableField[],
    fieldsSelected: IAvailableField[]
  ): IAvailableField[] => {
    if (additionalEntityColumns) {
      const entitySchemaMap = createHashMapFromArray<IAvailableField>(entityFields, 'schemaName');
      const selectedFieldsSchemaMap = createHashMapFromArray<IAvailableField>(
        fieldsSelected,
        'schemaName'
      );
      let additionalFields = additionalEntityColumns?.split(',')?.map((schemaName: string) => {
        const filteredField = entitySchemaMap[schemaName];
        if (filteredField && !selectedFieldsSchemaMap[schemaName]) {
          filteredField.isSelected = true;
          return filteredField;
        }
      });
      additionalFields = additionalFields?.filter((filled) => filled);
      return [...((additionalFields || []) as IAvailableField[]), ...fieldsSelected];
    }
    return fieldsSelected;
  };

  const getAugmenter = async (): Promise<ITabAugmenter> => {
    return (await getStandaloneSVAugmenter(tabId)) || (await getSVAugmenter(tabType));
  };

  const getEntityCode = async (): Promise<string | undefined> => {
    return (await getAugmenter())?.getEntityCode?.(tabId, selectedTabType) || entityCode;
  };
  async function fetchData(selectedFieldsSchema: string): Promise<void> {
    try {
      if (selectedTabType && TabType[tabType]) {
        setMaxAllowedSelection(maxAllowed);
        const updatedEntityCode = await getEntityCode();
        const config = await (
          await getAugmenter()
        )?.augmentedTabSettingsData?.[selectedTabType]?.({
          selectedFieldsSchema,
          maxAllowed,
          entityCode: updatedEntityCode,
          tabId,
          selectedHeaderAction: selectedTabType,
          columnConfigMap: columnConfigMap,
          featureRestrictionData
        });
        const fieldsConfig = config?.fields || [];
        const selectedFieldsConfig =
          handleAdditionalEntityColumns(config?.fields[0]?.data, config?.selectedFields) || [];

        const defaultFields = config?.defaultFields;

        setNormalizedData({
          tabConfig: TAB_SETTING_CONFIG[selectedTabType || ''],
          fieldConfig: fieldsConfig,
          selectedFields: selectedFieldsConfig,
          defaultFields: getDefaultFields(defaultFields),
          generateFilterData: config?.generateFilterData,
          resetNormalization: fetchData
        });
        setFields(fieldsConfig);
        setSelectedFields(selectedFieldsConfig);
      }
    } catch (error) {
      console.log(error);
      setNormalizedData(null);
    }
  }

  useEffect(() => {
    fetchData(selectedFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabType, selectedTabType]);

  return normalizedData;
};

export default useTabSettings;
export type { IUseTabSettings };
