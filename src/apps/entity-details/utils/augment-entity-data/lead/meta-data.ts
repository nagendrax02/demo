import { ILeadAttribute } from 'common/types/entity/lead';
import { IAugmentedMetaDataProvider } from 'common/types/entity/lead/metadata.types';

const getAugmentedMetaData = (
  metaDataFields: ILeadAttribute[] | undefined
): IAugmentedMetaDataProvider => {
  const leadAttribute: IAugmentedMetaDataProvider = {};

  for (const attribute of metaDataFields || []) {
    if (attribute && attribute.SchemaName) {
      const { SchemaName, RenderType, DataType, DisplayName, EntityAttributeType } = attribute;
      leadAttribute[SchemaName] = { RenderType, DataType, DisplayName, EntityAttributeType };
    }
  }

  return leadAttribute;
};

export { getAugmentedMetaData };
