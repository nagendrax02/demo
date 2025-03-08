import { EntityAttributeType, IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { EntityType, IOpportunity } from 'common/types';
import { getOpportunityFields } from '../vcard/utils';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { getValidDataType, getValidRenderType } from '../utils';
import { getBadgeConfig } from '../vcard/vcard-badge';
import { IConfig } from '../../../../types/vcard.types';
import { IPropertiesConfig } from '../../../../types';
import { getFieldAdditionalData } from '../attributes/metadata';
import { workAreaIds } from 'common/utils/process';
import { getOpportunityEventCode } from 'common/utils/helpers';
import { opportunityFeatureRestrictionConfigMap } from '../constants';

const getRenderConfig = (
  field: IActivityAttribute,
  entityData: IOpportunity
): Record<string, IConfig> | undefined => {
  if (field?.SchemaName === 'Status') {
    return {
      badgeConfig: getBadgeConfig(entityData)
    };
  }
  return undefined;
};

const getAugmentedEntityProperty = (
  field: IActivityAttribute,
  entityData: IOpportunity
): IEntityProperty => {
  const fieldData = entityData?.details?.Fields;
  const metaData = entityData?.metaData?.Fields;
  let value: string = '';
  if (field?.SchemaName === 'OpportunityAge') {
    const age = (fieldData && fieldData?.[field?.SchemaName]) || 0;
    value = Number(age) > 1 ? `${age} Days` : `${age} Day`;
  } else {
    value = (fieldData && fieldData?.[field?.SchemaName]) || '';
  }

  return {
    id: field?.SchemaName,
    name: field?.DisplayName,
    schemaName: field?.SchemaName,
    value: value,
    fieldRenderType: getValidRenderType(field),
    dataType: getValidDataType(field),
    entityAttributeType: field?.EntityAttributeType as EntityAttributeType,
    customObjectMetaData: metaData?.[field?.SchemaName]?.CustomObjectMetaData,
    additionalData: getFieldAdditionalData(field, entityData),
    componentConfig: getRenderConfig(field, entityData)
  };
};

const getOpportunityProperties = (entityData: IOpportunity): IPropertiesConfig => {
  let augmentedEntityProperties: IEntityProperty[] = [];
  const opportunityFields = getOpportunityFields(
    entityData?.details?.VCardConfiguration,
    entityData?.details?.EntityAttribute
  );

  if (opportunityFields?.length) {
    opportunityFields?.forEach((field) => {
      augmentedEntityProperties.push(getAugmentedEntityProperty(field, entityData));
    });
  }

  let vCardPropCount = 2;
  if (entityData?.details?.EntityDetailsViewId) {
    vCardPropCount = entityData?.details?.VCardConfiguration?.[0]?.Fields?.length || 2;
  }

  augmentedEntityProperties = augmentedEntityProperties
    ? [...augmentedEntityProperties.slice(vCardPropCount)]
    : [];

  const augmentedFields = { ...entityData?.details?.Fields, CanUpdate: 'true' };

  return {
    entityProperty: augmentedEntityProperties,
    fields: augmentedFields,
    entityConfig: {},
    title: `${entityData?.details?.OppRepresentationName?.Singular} Properties`,
    editActionType: EntityType.Opportunity,
    formTitle: `Edit ${
      // eslint-disable-next-line @typescript-eslint/dot-notation
      augmentedFields?.['mx_Custom_1'] || entityData?.details?.OppRepresentationName?.Singular
    }`,
    featureRestrictionConfig:
      opportunityFeatureRestrictionConfigMap.OpportunityDetailPropertiesEdit,
    workAreaConfig: {
      workAreaId: workAreaIds.OPPORTUNITY_DETAILS.EDIT_OPPORTUNITY_DETAILS_V_CARD,
      additionalData: `${getOpportunityEventCode()}`
    }
  };
};

export { getOpportunityProperties };
