import { ILeadMetaData, IOpportunity } from 'common/types';
import { DataType, ILeadAttribute, RenderType } from 'common/types/entity/lead';
import { getValidDataType, getValidRenderType } from '../utils';
import { getOppStatusData } from '../vcard/vcard-badge';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { getOpportunitySourceAttributes } from '../vcard/vcard-source';

export const getFieldAdditionalData = (
  field: IActivityAttribute,
  entityData: IOpportunity
): Record<string, string> | undefined => {
  if (field?.SchemaName === 'Status') {
    return {
      status: JSON.stringify(getOppStatusData(entityData))
    };
  }
  if (field?.InternalSchemaName === 'OpportunitySourceName') {
    return {
      source: JSON.stringify(getOpportunitySourceAttributes(entityData))
    };
  }

  return undefined;
};

export const getAugmentedMetaData = (entityData: IOpportunity): ILeadMetaData => {
  const augmentedMetaData: ILeadAttribute[] = [];

  if (entityData?.metaData?.Fields) {
    Object.values(entityData?.metaData?.Fields).forEach((field) => {
      augmentedMetaData.push({
        SchemaName: field?.SchemaName,
        DisplayName: field?.DisplayName,
        DataType: getValidDataType(field),
        RenderType: getValidRenderType(field),
        additionalData: getFieldAdditionalData(field, entityData),
        CustomObjectMetaData: field?.CustomObjectMetaData,
        showAll: true
      });
    });
  }

  augmentedMetaData.push({
    SchemaName: 'RelatedLead',
    DisplayName: 'Associated Lead',
    DataType: DataType.Lead,
    RenderType: RenderType.AssociatedLead,
    entityId: entityData?.details?.RelatedProspectId
  });

  return {
    Fields: augmentedMetaData
  };
};
