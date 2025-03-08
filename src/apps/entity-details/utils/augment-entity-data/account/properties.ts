import { IAccount, IEntity } from 'common/types';
import { getMetaDataDictionary } from './vcard-metadata';
import {
  IAccountAttribute,
  IAugmentedMetaData,
  IEntityProperty,
  IProperty
} from 'common/types/entity/account/metadata.types';
import { IAccountDetails, IField } from 'common/types/entity/account/details.types';
import { DataType, RenderType } from 'common/types/entity/lead';
import { SOCIAL_MEDIA } from 'apps/entity-details/types/entity-data.types';
import { SCHEMA_NAME } from 'common/component-lib/activity-table/constants';

const getAugmentedFieldRenderType = (
  field: IField,
  accountAugmentedMetaData: Record<string, IAugmentedMetaData>
): RenderType => {
  let renderType = accountAugmentedMetaData?.[field?.SchemaName]?.RenderType;
  if (renderType === RenderType.Phone || renderType === RenderType.Email) {
    renderType = RenderType.Textbox;
  } else if (SOCIAL_MEDIA.includes(field?.SchemaName?.toLocaleLowerCase())) {
    // above condition is for all social media, since they have render type as Textbox, hence augmenting to  Social Media type
    renderType = RenderType.SocialMedia;
  } else if (
    field?.SchemaName === SCHEMA_NAME.OWNER_ID_SCHEMA_NAME ||
    field?.SchemaName === SCHEMA_NAME.MODIFIED_BY_SCHEMA_NAME ||
    field?.SchemaName === SCHEMA_NAME.CREATED_BY_SCHEMA_NAME
  ) {
    renderType = RenderType.UserName;
  }

  return renderType;
};

const getAugmentedFieldDataType = (
  field: IField,
  accountAugmentedMetaData: Record<string, IAugmentedMetaData>
): DataType => {
  let dataType = accountAugmentedMetaData?.[field?.SchemaName]?.DataType;

  if (dataType === DataType.Phone || dataType === DataType.Email) {
    dataType = DataType.Text;
  }
  return dataType;
};

const getAugmentedEntityProperty = (
  accountDetail: IAccountDetails,
  accountAugmentedMetaData: Record<string, IAugmentedMetaData>
): IEntityProperty[] => {
  const accountPropertiesValue = accountDetail?.PropertiesConfiguration?.Sections?.[0];
  const augmentedAccountProperties: IEntityProperty[] = [];
  accountPropertiesValue?.Fields?.forEach((field) => {
    if (accountAugmentedMetaData?.[field?.SchemaName]) {
      augmentedAccountProperties.push({
        id: field?.SchemaName,
        name: accountAugmentedMetaData[field?.SchemaName]?.DisplayName,
        value: accountDetail.Fields[field?.SchemaName] || '',
        fieldRenderType: getAugmentedFieldRenderType(field, accountAugmentedMetaData),
        schemaName: field?.SchemaName,
        dataType: getAugmentedFieldDataType(field, accountAugmentedMetaData)
      });
    }
  });

  return augmentedAccountProperties;
};

const getAugmentedProperty = (entityData: IEntity): IProperty => {
  const augmentedMetaData = getMetaDataDictionary(
    (entityData?.metaData?.Fields || []) as IAccountAttribute[]
  );
  const accountDetails = entityData?.details;

  return {
    entityProperty: getAugmentedEntityProperty(
      accountDetails as IAccountDetails,
      augmentedMetaData
    ),
    fields: accountDetails?.Fields,
    entityConfig: {},
    title: `${(entityData as IAccount).details?.AccountTypeName} Properties`
  };
};

export { getAugmentedProperty };
