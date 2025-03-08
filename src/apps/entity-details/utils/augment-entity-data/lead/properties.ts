import { EntityType, ILeadDetails } from 'common/types';
import {
  DataType,
  EntityAttributeType,
  IAugmentedMetaDataProvider,
  ICustomObjectAttribute,
  IEntityProperty,
  IProperty,
  PhotoUrlSchemaName,
  RenderType,
  SchemaName,
  Timezone
} from 'common/types/entity/lead/metadata.types';
import { LEAD_PROPERTIES } from '../../../constants';

import { getAugmentedMetaData } from './meta-data';
import { IField, ILead } from 'common/types/entity/lead';
import { SOCIAL_MEDIA } from 'apps/entity-details/types/entity-data.types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { TAB_ID } from 'common/component-lib/entity-tabs/constants/tab-id';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';

const getValue = (fields: Record<string, string | null>, schemaName: string): string | null => {
  if (schemaName === LEAD_SCHEMA_NAME.LEAD_AGE) {
    return fields?.[LEAD_SCHEMA_NAME.LEAD_AGE] === '1'
      ? `${fields?.[LEAD_SCHEMA_NAME.LEAD_AGE]}Day`
      : `${fields?.[LEAD_SCHEMA_NAME.LEAD_AGE]} Days`;
  }
  if (schemaName === 'Revenue') {
    return fields?.Revenue === null ? '0.00' : fields.Revenue;
  }
  return fields?.[schemaName] === null ? '' : fields?.[schemaName];
};

// eslint-disable-next-line complexity
const getAugmentedFieldRenderType = ({
  field,
  leadAugmentedMetaData,
  entityType,
  tabId
}: {
  field: IField;
  leadAugmentedMetaData: IAugmentedMetaDataProvider | Record<string, ICustomObjectAttribute>;
  entityType?: EntityType;
  tabId?: string;
}): RenderType => {
  // below condition is to handle when schema name is of particular type but the renderType is not UserName
  if (field?.SchemaName === SchemaName.RelatedCompanyId) {
    return RenderType.Account;
  } else if (
    entityType !== EntityType.Opportunity &&
    (SchemaName[field?.SchemaName] ||
      leadAugmentedMetaData?.[field?.SchemaName]?.DataType === DataType.ActiveUsers)
  ) {
    return RenderType.UserName;
  } else if (
    leadAugmentedMetaData?.[field?.SchemaName]?.DataType === DataType.Phone &&
    leadAugmentedMetaData?.[field?.SchemaName]?.RenderType === RenderType.Textbox
  ) {
    // above condition is to for handling phone type, since for this render type is textbox, hence augmenting to Phone type
    return RenderType.Phone;
  } else if (SOCIAL_MEDIA.includes(field?.SchemaName?.toLocaleLowerCase())) {
    // above condition is for all social media, since they have render type as Textbox, hence augmenting to  Social Media type
    return RenderType.SocialMedia;
  } else if (field?.SchemaName === PhotoUrlSchemaName) {
    return RenderType.URL;
  } else if (field?.SchemaName === Timezone && tabId !== TAB_ID.AccountDetails) {
    return RenderType.TimeZone;
  } else if (leadAugmentedMetaData?.[field?.SchemaName]?.RenderType === 'String_TextContent_CMS') {
    return RenderType.HTML;
  } else if (
    entityType === EntityType.Opportunity &&
    leadAugmentedMetaData?.[field?.SchemaName]?.DataType === DataType.ActiveUsers
  ) {
    return RenderType.Text;
  }

  return leadAugmentedMetaData?.[field?.SchemaName]?.RenderType as RenderType;
};

const getAugmentedName = (
  leadAugmentedMetaData: IAugmentedMetaDataProvider,
  field: IField,
  leadFields: Record<string, string | null>
): string => {
  if (field?.SchemaName === SchemaName.RelatedCompanyId) {
    return leadFields?.[LEAD_SCHEMA_NAME.RELATED_COMPANY_ID_NAME] || '';
  }
  return leadAugmentedMetaData?.[field?.SchemaName]?.DisplayName;
};

const isValidField = (field: IField): boolean => {
  const deprecatedSchemaNames = ['GTalkId', 'GooglePlusId'];
  if (deprecatedSchemaNames?.includes(field?.SchemaName)) {
    return false;
  }
  return true;
};

const getAugmentedEntityProperty = (
  leadDetail: ILeadDetails,
  leadAugmentedMetaData: IAugmentedMetaDataProvider,
  leadFields: Record<string, string | null>
): IEntityProperty[] => {
  const leadPropertiesValue = leadDetail?.VCardConfiguration?.Sections?.find(
    (section) => section.Name === LEAD_PROPERTIES
  );
  const augmentedLeadProperties: IEntityProperty[] = [];
  leadPropertiesValue?.Fields?.forEach((field) => {
    if (leadAugmentedMetaData?.[field?.SchemaName] && isValidField(field))
      augmentedLeadProperties.push({
        id: field?.SchemaName,
        name: getAugmentedName(leadAugmentedMetaData, field, leadFields),
        schemaName: field?.SchemaName,
        value: getValue(leadDetail?.Fields, field?.SchemaName) || '',
        fieldRenderType: getAugmentedFieldRenderType({ field, leadAugmentedMetaData }),
        dataType: leadAugmentedMetaData?.[field?.SchemaName]?.DataType,
        entityAttributeType: leadAugmentedMetaData?.[field?.SchemaName]
          ?.EntityAttributeType as EntityAttributeType
      });
  });

  return augmentedLeadProperties;
};

const getAugmentedLeadProperty = (entityData: ILead): IProperty => {
  const augmentedMetaData = getAugmentedMetaData(entityData?.metaData?.Fields);
  const leadDetails = entityData?.details;
  return {
    entityProperty: getAugmentedEntityProperty(
      leadDetails,
      augmentedMetaData,
      entityData?.details?.Fields
    ),
    fields: leadDetails?.Fields,
    entityConfig: {},
    featureRestrictionConfig: {
      moduleName: FeatureRestrictionModuleTypes.LeadDetails,
      actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.LeadDetails].EditLead,
      callerSource: CallerSource?.LeadDetailsVCard
    }
  };
};

export { getAugmentedEntityProperty, getAugmentedLeadProperty, getAugmentedFieldRenderType };
