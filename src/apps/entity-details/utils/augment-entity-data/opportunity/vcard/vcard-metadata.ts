import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { IMetaDataConfig } from '../../../../types';
import { IOpportunity } from 'common/types';
import { getOpportunitySourceSecondaryConfig } from './vcard-source';
import { OPP_INTERNAL_SCHEMA_NAMES } from '../constants';
import { getValidDataType, getValidRenderType } from '../utils';

const getAugmentedMetaData = (
  entityData: IOpportunity,
  fieldConfig: IActivityAttribute
): IMetaDataConfig => {
  const fieldData = entityData?.details?.Fields;
  return {
    SchemaName: fieldConfig?.SchemaName,
    DisplayName: fieldConfig?.DisplayName,
    DataType: getValidDataType(fieldConfig),
    RenderType: getValidRenderType(fieldConfig),
    Value: fieldData?.[fieldConfig?.SchemaName] || '',
    vCardDisplayName: fieldConfig?.DisplayName
  };
};

const getMetaDataConfig = (
  entityData: IOpportunity,
  fieldConfig: IActivityAttribute
): IMetaDataConfig[] => {
  if (fieldConfig?.InternalSchemaName === OPP_INTERNAL_SCHEMA_NAMES.opportunitySourceName) {
    return [getOpportunitySourceSecondaryConfig(entityData, fieldConfig)];
  }
  return [getAugmentedMetaData(entityData, fieldConfig)];
};

export { getMetaDataConfig };
