import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import {
  ActivityBaseAttributeDataType,
  DataType,
  ICustomObjectAttribute,
  RenderType
} from 'common/types/entity/lead';
import { IActivityDetails } from 'common/component-lib/activity-table/utils/config/data-fetcher';
import { IField } from 'common/component-lib/activity-table/activity-table.types';
import {
  IActivityMetaData,
  IActivityMetaDataMap
} from 'common/utils/entity-data-manager/activity/activity.types';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';
import { MASKED_TEXT } from 'common/constants';
import { ComponentType, IBodyConfig, IMetaDataConfig } from 'apps/entity-details/types/vcard.types';
import { IconContentType } from 'apps/entity-details/types';
import styles from './row-detail.module.css';
import { EntityType } from 'common/types';
import { CallerSource } from 'common/utils/rest-client';
import { IRecordType } from '../../smartview-tab/smartview-tab.types';

const getAugmentedCfsFields = ({
  cfsAttributeFields,
  cfsFieldsMetadata,
  leadId,
  activityId
}: {
  leadId?: string;
  activityId?: string;
  cfsAttributeFields: IField[];
  cfsFieldsMetadata: ICustomObjectAttribute[] | undefined;
}): IAugmentedAttributeFields[] => {
  if (!cfsAttributeFields?.length || !cfsFieldsMetadata?.length) {
    return [];
  }

  try {
    const cfsMetadataHashMap = createHashMapFromArray(cfsFieldsMetadata || [], 'SchemaName');
    return cfsAttributeFields?.map((cfsAttributeField) => {
      const cfsMetadata = cfsMetadataHashMap[cfsAttributeField?.SchemaName];
      const renderType =
        cfsAttributeField?.Value === MASKED_TEXT ? RenderType.Text : cfsAttributeField.RenderType;

      return {
        id: cfsAttributeField?.SchemaName,
        entityId: activityId,
        leadId,
        isActivity: true,
        name: cfsMetadata?.DisplayName || cfsAttributeField?.DisplayName,
        displayValue: cfsAttributeField.DisplayValue,
        schemaName: cfsAttributeField?.SchemaName,
        value: cfsAttributeField?.Value,
        fieldRenderType: (renderType || cfsMetadata?.DataType) as RenderType,
        dataType: cfsMetadata?.DataType,
        colSpan: 1,
        isMatched: false
      };
    });
  } catch (error) {
    trackError(error);
    return [];
  }
};

const getfieldenderType = (renderType: RenderType | DataType): RenderType => {
  switch (renderType) {
    case RenderType.Product:
      return RenderType.String;
  }
  return renderType as RenderType;
};

export const fetchEntityMetaData = async ({
  entityType,
  item
}: {
  item: IRecordType;
  entityType?: EntityType;
}): Promise<IActivityMetaData> => {
  let metaData: IActivityMetaData;
  if (entityType === EntityType.Opportunity) {
    metaData = (await (
      await import('common/utils/entity-data-manager/opportunity')
    ).default.fetchMetaData(
      CallerSource.SmartViews,
      item.ActivityEvent as string
    )) as IActivityMetaData;
    metaData = { ...metaData, metaDataMap: metaData.Fields as unknown as IActivityMetaDataMap };
    if (metaData?.metaDataMap?.mx_Custom_1) {
      const updatedMetaData = {
        ...metaData?.metaDataMap?.mx_Custom_1,
        RenderType: RenderType.OpportunityName
      };
      metaData = {
        ...metaData,
        metaDataMap: {
          ...metaData.metaDataMap,
          ['mx_Custom_1']: updatedMetaData
        }
      };
    }
  } else {
    metaData = await (
      await import('common/utils/entity-data-manager/activity')
    ).default.fetchMetaData(parseInt(item.ActivityEvent || '', 10), CallerSource.SmartViews);
  }
  return metaData;
};

export const getAugmentedAttributeFields = ({
  activityDetails,
  activityMetaData
}: {
  activityDetails: IActivityDetails & { activityId: string; leadId: string };
  activityMetaData: IActivityMetaData;
}): IAugmentedAttributeFields[] => {
  if (!activityDetails?.Fields?.length) return [];
  const { Fields } = activityDetails;
  try {
    // eslint-disable-next-line complexity
    return (Fields as IField[])?.reduce((acc: IAugmentedAttributeFields[], field) => {
      if (!activityMetaData?.metaDataMap?.[field?.SchemaName]) {
        return acc;
      }
      const metaData = activityMetaData?.metaDataMap?.[field?.SchemaName];
      acc.push({
        id: field?.SchemaName,
        schemaName: field?.SchemaName,
        name: field?.DisplayName,
        value: field.Value,
        displayValue: field.DisplayValue,
        entityId: activityDetails.activityId,
        isActivity: true,
        leadId: activityDetails.leadId,
        isRenderedInGrid: true,
        fieldRenderType: getfieldenderType(metaData.RenderType || metaData.DataType),
        dataType: field?.DataType as DataType,
        colSpan: 1,
        eventCode: `${activityDetails?.ActivityCode}`,
        cfsFields:
          metaData?.DataType === ActivityBaseAttributeDataType.CustomObject && field?.Fields
            ? getAugmentedCfsFields({
                cfsAttributeFields: field.Fields,
                cfsFieldsMetadata: metaData?.CustomObjectMetaData?.Fields,
                activityId: activityDetails.activityId,
                leadId: activityDetails.leadId
              })
            : [],
        isMatched: false
      });
      return acc;
    }, []);
  } catch (error) {
    trackError(error);
    return [];
  }
};

const vcardSecondaryData: IMetaDataConfig[] = [
  {
    SchemaName: 'EmailAddress',
    DisplayName: 'Email',
    RenderType: RenderType.Email,
    DataType: DataType.Email,
    Value: ''
  },
  {
    SchemaName: 'Phone',
    DisplayName: 'Phone',
    RenderType: RenderType.Phone,
    DataType: DataType.Phone,
    Value: ''
  },
  {
    SchemaName: 'P_mx_City',
    DisplayName: 'Address',
    RenderType: RenderType.Textbox,
    DataType: DataType.Text,
    Value: ''
  }
];

const getSecondarySection = (data: Record<string, string | null>): IMetaDataConfig[] => {
  const components: IMetaDataConfig[] = [];
  vcardSecondaryData.forEach((item) => {
    const augmentedItem = { ...item };
    if (item.SchemaName === 'P_mx_City') {
      augmentedItem.Value = `${data[item.SchemaName] || ''}${
        data.P_mx_State ? ', ' + data.P_mx_State : ''
      }${data.P_mx_Country ? ', ' + data.P_mx_Country : ''}`;
      if (augmentedItem.Value) {
        components.push({ ...augmentedItem });
      }
    } else if (data[item.SchemaName]) {
      augmentedItem.Value = data[item.SchemaName] || '';
      components.push({ ...augmentedItem });
    }
  });
  return components;
};

export const getProfileName = (firstName: string, lastName: string): string => {
  try {
    return `${firstName?.[0]?.toUpperCase() || ''}${lastName?.[0]?.toUpperCase() || ''}`;
  } catch (e) {
    // eslint-disable-next-line no-console
    trackError(e);
  }
  return '';
};

export const getLeadVcardInfo = (data: Record<string, string | null>): IBodyConfig => {
  return {
    icon: {
      content: data?.P_PhotoUrl
        ? data.P_PhotoUrl
        : getProfileName(data.FirstName || '', data.LastName || ''),
      contentType: data?.P_PhotoUrl ? IconContentType.Image : IconContentType.Text,
      customStyleClass: styles.profile_image
    },
    primarySection: {
      components: [
        {
          config: { content: data?.LeadName?.trim() || '[No Name]' },
          type: ComponentType.Title,
          customStyleClass: styles.title
        },
        {
          config: { content: data.P_ProspectStage || '' },
          type: 3,
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

export const getWidthFromParentGrid = (tabId: string): string => {
  const gridElement = document.getElementsByClassName(`smart-views-grid-wrapper-${tabId}`);
  if (gridElement?.[0]) {
    return `${Math.max(gridElement?.[0]?.clientWidth - 50, 0)}px`;
  }

  return '97%';
};
