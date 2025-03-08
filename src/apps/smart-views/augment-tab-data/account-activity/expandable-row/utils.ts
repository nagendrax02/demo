import { trackError } from 'common/utils/experience/utils/track-error';
import { ComponentType, IBodyConfig, IMetaDataConfig } from 'apps/entity-details/types/vcard.types';
import { getAugmentedIcon } from 'apps/entity-details/utils/augment-entity-data/account/vcard-icon';
import styles from './expandable-row.module.css';
import { vCardSecondaryData } from './constant';
import { IActivityDetails } from 'common/component-lib/activity-table/utils/config/data-fetcher';
import { API_ROUTES } from 'common/constants';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { IAugmentedSmartViewEntityMetadata } from '../../common-utilities/common.types';
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import { ActivityBaseAttributeDataType, DataType, RenderType } from 'common/types/entity/lead';
import { IField } from 'common/component-lib/activity-table/activity-table.types';
import { handleUserInActivity } from '../helpers';
import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

const getDependentSchema = (
  schemas: string[],
  data: Record<string, string | null>,
  value: string
): string => {
  const dependentSchemaValues =
    schemas?.map((schema) => {
      return data[schema] ? data[schema] : '';
    }) ?? [];

  dependentSchemaValues.unshift(value);

  return dependentSchemaValues.filter((fieldValue) => fieldValue)?.join(', ');
};

const getSecondarySection = (data: Record<string, string | null>): IMetaDataConfig[] => {
  const components: IMetaDataConfig[] = [];

  vCardSecondaryData.forEach((item) => {
    const augmentedItem = { ...item };

    if (item.dependentSchema?.length) {
      augmentedItem.Value = getDependentSchema(
        item.dependentSchema,
        data,
        data[item.SchemaName] || ''
      );
    } else {
      augmentedItem.Value = data[item.SchemaName] || '';
    }
    if (augmentedItem.Value) {
      components.push(augmentedItem);
    }
  });

  return components;
};

export const getVCardInfo = (data: Record<string, string | null>): IBodyConfig => {
  return {
    icon: { ...getAugmentedIcon(), customStyleClass: styles.profile_image },
    primarySection: {
      components: [
        {
          config: { content: data?.C_CompanyName?.trim() || '[No Name]' },
          type: ComponentType.Title,
          customStyleClass: styles.title
        },
        {
          config: { content: data.C_Stage || '' },
          type: ComponentType.Badge,
          customStyleClass: styles.badge
        }
      ]
    },
    secondarySection: {
      components: [
        {
          type: ComponentType.MetaData,
          config: getSecondarySection(data),
          customStyleClass: styles.secondary_data
        }
      ]
    }
  };
};

const getFieldRenderType = (renderType: RenderType, dataType: DataType): RenderType => {
  if (dataType === DataType.ActiveUsers) return RenderType.UserName;
  return renderType || dataType;
};

export const getAugmentedAttributeFields = (
  activityDetails: IActivityDetails & { CompanyActivityId: string },
  activityMetaData: Record<string, IAugmentedSmartViewEntityMetadata>,
  tabId: string
): IAugmentedAttributeFields[] => {
  try {
    const schemaValueMap = {} as IRecordType;
    const fields = (activityDetails?.Fields as IField[])?.reduce((acc, field) => {
      const metaData = activityMetaData?.[field?.SchemaName];
      if (!metaData) return acc;

      if (field.Value) {
        acc.push({
          id: metaData.schemaName,
          schemaName: metaData.schemaName,
          name: metaData.displayName,
          value: field.Value,
          displayValue: metaData.displayName,
          isRenderedInGrid: true,
          doNotUseNameAsValue: true,
          fieldRenderType: getFieldRenderType(metaData.renderType, metaData.dataType as DataType),
          dataType: metaData?.dataType as ActivityBaseAttributeDataType,
          colSpan: 1
        });

        if (metaData.dataType === DataType.ActiveUsers) {
          schemaValueMap[metaData.schemaName] = field.Value;
        }
      }
      return acc;
    }, [] as IAugmentedAttributeFields[]);
    handleUserInActivity([schemaValueMap], tabId, activityMetaData);
    return fields;
  } catch (error) {
    trackError(error);
  }
  return [];
};

export const fetchActivityDetails = async (id: string): Promise<IActivityDetails | null> => {
  try {
    const response: IActivityDetails = await httpGet({
      path: `${API_ROUTES.accountActivityDetails}?activityId=${id}`,
      module: Module.Marvin,
      callerSource: CallerSource.SmartViews
    });
    return response;
  } catch (error) {
    trackError(error);
  }
  return null;
};
