import { IEntity } from 'common/types';
import { IEntityProperty, IProperty } from 'common/types/entity/account/metadata.types';
import { IAccountDetails, IField } from 'common/types/entity/account/details.types';
import { DataType, ILeadMetadataMap, RenderType } from 'common/types/entity/lead';

import {
  ASSOCIATED_LEAD_EMAIL_SCHEMA_NAME,
  ASSOCIATED_LEAD_PHONE_SCHEMA_NAME,
  ASSOCIATED_LEAD_SCHEMA_NAME,
  ASSOCIATED_LEAD_STAGE_SCHEMA_NAME,
  PRIMARY_CONTACT
} from 'apps/entity-details/constants';
import { NO_NAME } from 'common/constants';
import { StorageKey, getItem } from 'common/utils/storage-manager';

const getAssociatedAugmentedFieldRenderType = (
  field: IField,
  augmentedMetaData: ILeadMetadataMap
): RenderType => {
  const schemaMapping = {
    [ASSOCIATED_LEAD_SCHEMA_NAME]: RenderType.PrimaryContactName,
    [ASSOCIATED_LEAD_EMAIL_SCHEMA_NAME]: RenderType.Textbox,
    [ASSOCIATED_LEAD_PHONE_SCHEMA_NAME]: RenderType.Textbox,
    [ASSOCIATED_LEAD_STAGE_SCHEMA_NAME]:
      augmentedMetaData?.[field?.SchemaName?.slice(3)]?.RenderType
  };

  return schemaMapping?.[field?.SchemaName]
    ? (schemaMapping?.[field?.SchemaName] as RenderType)
    : augmentedMetaData?.[field?.SchemaName?.slice(3)]?.RenderType;
};

const getAssociatedAugmentedFieldDataType = (
  field: IField,
  augmentedMetaData: ILeadMetadataMap
): DataType => {
  const schemaMapping = {
    [ASSOCIATED_LEAD_SCHEMA_NAME]: augmentedMetaData?.[field?.SchemaName?.slice(3)]?.DataType,
    [ASSOCIATED_LEAD_EMAIL_SCHEMA_NAME]: DataType.Text,
    [ASSOCIATED_LEAD_PHONE_SCHEMA_NAME]: DataType.Text,
    [ASSOCIATED_LEAD_STAGE_SCHEMA_NAME]: augmentedMetaData?.[field?.SchemaName?.slice(3)]?.DataType
  };

  return schemaMapping?.[field?.SchemaName]
    ? (schemaMapping?.[field?.SchemaName] as DataType)
    : augmentedMetaData?.[field?.SchemaName?.slice(3)]?.DataType;
};

// eslint-disable-next-line complexity
const getAssociatedFieldValue = (accountDetail: IAccountDetails, field: IField): string => {
  const schemaMapping = {
    [ASSOCIATED_LEAD_SCHEMA_NAME]:
      accountDetail?.Fields[field?.SchemaName] ||
      accountDetail?.Fields[ASSOCIATED_LEAD_EMAIL_SCHEMA_NAME.replace('Address', '')] ||
      accountDetail?.Fields[ASSOCIATED_LEAD_PHONE_SCHEMA_NAME] ||
      NO_NAME,
    [ASSOCIATED_LEAD_EMAIL_SCHEMA_NAME]:
      accountDetail.Fields[field?.SchemaName.replace('Address', '')] || '',
    [ASSOCIATED_LEAD_PHONE_SCHEMA_NAME]: accountDetail.Fields[field?.SchemaName] || '',
    [ASSOCIATED_LEAD_STAGE_SCHEMA_NAME]: accountDetail.Fields[field?.SchemaName] || ''
  };

  return schemaMapping?.[field?.SchemaName]
    ? (schemaMapping?.[field?.SchemaName] as string)
    : accountDetail.Fields[field?.SchemaName] || '';
};

const ASSOCIATED_PROPERTY = [
  ASSOCIATED_LEAD_SCHEMA_NAME,
  ASSOCIATED_LEAD_EMAIL_SCHEMA_NAME,
  ASSOCIATED_LEAD_PHONE_SCHEMA_NAME
];

const getAssociatedAugmentedEntityProperty = (
  accountDetail: IAccountDetails,
  augmentedMetaData: ILeadMetadataMap
): IEntityProperty[] => {
  const accountPropertiesValue = accountDetail?.VCardConfiguration?.Sections?.find(
    (section) => section.Name === PRIMARY_CONTACT
  );

  const augmentedAssociatedAccountProperties: IEntityProperty[] = [];
  accountPropertiesValue?.Fields?.forEach((field) => {
    if (
      ASSOCIATED_PROPERTY.includes(field?.SchemaName) ||
      field?.SchemaName !== ASSOCIATED_LEAD_STAGE_SCHEMA_NAME
    )
      augmentedAssociatedAccountProperties.push({
        id: field?.SchemaName,
        name: field?.DisplayName,
        value: getAssociatedFieldValue(accountDetail, field),
        fieldRenderType: getAssociatedAugmentedFieldRenderType(field, augmentedMetaData),
        schemaName: field?.SchemaName,
        dataType: getAssociatedAugmentedFieldDataType(field, augmentedMetaData),
        config: {
          config: { id: accountDetail?.LeadId }
        }
      });
  });

  return augmentedAssociatedAccountProperties;
};

const getAssociatedAugmentedProperty = (entityData: IEntity): IProperty => {
  const leadMetaData = getItem(StorageKey.LDMetaData);
  const accountDetails = entityData?.details;

  return {
    entityProperty: getAssociatedAugmentedEntityProperty(
      accountDetails as IAccountDetails,
      leadMetaData as ILeadMetadataMap
    ),
    fields: accountDetails?.Fields,
    entityConfig: {}
  };
};

export { getAssociatedAugmentedProperty, getAssociatedAugmentedEntityProperty };
