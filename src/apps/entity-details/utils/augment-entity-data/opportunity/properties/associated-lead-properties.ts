import { EntityType, IOpportunity } from 'common/types';
import {
  EntityAttributeType,
  IEntityProperty,
  ILeadAttribute,
  RenderType
} from 'common/types/entity/lead/metadata.types';
import { getLeadAge, getLeadName, getValidDataType, getValidRenderType } from '../utils';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';
import { IPropertiesConfig } from '../../../../types';
import { leadFeatureRestrictionConfigMap } from '../../lead/constants';

export const getLeadFields = (entityData: IOpportunity): ILeadAttribute[] | null | undefined => {
  try {
    const oppVCardConfig = entityData?.details?.VCardConfiguration;
    const associatedLeadMetaData = entityData?.details?.AssociatedLeadData?.metaData?.Fields;
    const associatedLeadMetaDataMap = createHashMapFromArray<ILeadAttribute>(
      associatedLeadMetaData || [],
      'SchemaName'
    );
    if (oppVCardConfig) {
      const fields = oppVCardConfig?.find((item) => item.DisplayName === 'Related Lead')?.Fields;

      const fieldsWithDisplayName = fields?.map((field) => {
        return associatedLeadMetaDataMap?.[field && field?.SchemaName];
      });

      return fieldsWithDisplayName;
    }
    return [];
  } catch (error) {
    console.log('error');
    return null;
  }
};

const getAugmentedLeadProperty = (
  field: ILeadAttribute,
  entityData: IOpportunity
): IEntityProperty => {
  const leadFieldData = entityData?.details?.AssociatedLeadData?.details?.Fields;

  let value = '';
  if (field?.SchemaName === 'LeadAge') {
    value = getLeadAge((leadFieldData && leadFieldData?.[field?.SchemaName]) || '');
  } else {
    value = (leadFieldData && leadFieldData?.[field?.SchemaName]) || '';
  }

  return {
    id: field?.SchemaName,
    name: field?.DisplayName,
    schemaName: field?.SchemaName,
    value: value,
    fieldRenderType: getValidRenderType(field),
    dataType: getValidDataType(field),
    entityAttributeType: field?.EntityAttributeType as EntityAttributeType,
    showAll: true,
    customObjectMetaData: field?.CustomObjectMetaData,
    isAssociatedLeadProperty: true
  };
};

const getAssociatedLeadNameProperty = (entityData: IOpportunity): IEntityProperty | undefined => {
  const associatedLeadEntityAttribute = entityData?.details?.AssociatedLeadData?.metaData?.Fields;
  const leadFieldData = entityData?.details?.AssociatedLeadData?.details?.Fields;
  const leadFirstNameProperty = associatedLeadEntityAttribute?.find(
    (attribute) => attribute?.SchemaName === 'FirstName'
  );

  if (leadFirstNameProperty) {
    return {
      id: leadFirstNameProperty?.SchemaName,
      name: `${entityData?.details?.LeadRepresentationName?.SingularName || 'Lead'} Name`,
      schemaName: leadFirstNameProperty?.SchemaName,
      value: getLeadName(leadFieldData),
      fieldRenderType: RenderType.AssociatedLead,
      dataType: getValidDataType(leadFirstNameProperty),
      entityAttributeType: leadFirstNameProperty?.EntityAttributeType as EntityAttributeType,
      entityId: entityData?.details?.RelatedProspectId
    };
  }

  return undefined;
};

const getAssociatedLeadProperties = (entityData: IOpportunity): IPropertiesConfig | undefined => {
  const augmentedEntityProperties: IEntityProperty[] = [];

  const associatedLeadFields = getLeadFields(entityData);
  if (associatedLeadFields && associatedLeadFields?.length) {
    associatedLeadFields.forEach((field) => {
      if (field?.SchemaName !== 'FirstName' && field?.SchemaName !== 'LastName') {
        augmentedEntityProperties.push(getAugmentedLeadProperty(field, entityData));
      }
    });
  }

  const associatedLeadName = getAssociatedLeadNameProperty(entityData);
  if (associatedLeadName) {
    augmentedEntityProperties.unshift(associatedLeadName);
  }

  return {
    entityProperty: augmentedEntityProperties,
    fields: entityData?.details?.AssociatedLeadData?.details?.Fields || {},
    entityConfig: {},
    title: `Associated ${entityData?.details?.LeadRepresentationName?.SingularName}`,
    editActionType: EntityType.Lead,
    formTitle: `Edit Associated ${entityData?.details?.LeadRepresentationName?.SingularName} Properties`,
    isAssociatedEntity: true,
    featureRestrictionConfig: leadFeatureRestrictionConfigMap?.Edit
  };
};

export { getAssociatedLeadProperties };
