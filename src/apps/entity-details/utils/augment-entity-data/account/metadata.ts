import { IAccountMetaData } from 'common/types/entity/account/metadata.types';
import { accountSpecialSchemaName } from './constants';
import { RenderType } from 'common/types/entity/lead';

export const getAugmentedMetaData = (entityData: IAccountMetaData): IAccountMetaData => {
  const modifiedFields = entityData?.Fields?.map((field) => {
    if (accountSpecialSchemaName.includes(field.SchemaName)) field.RenderType = RenderType.UserName;
    else if (field.SchemaName === 'TimeZone') field.RenderType = RenderType.TextArea;
    else if (field.DataType === 'Phone') field.RenderType = RenderType.Text;
    else if (field.DataType === 'Email') field.RenderType = RenderType.Text;
    return field;
  });

  return {
    AccountRepresentationConfig: entityData?.AccountRepresentationConfig,
    Fields: modifiedFields,
    LeadRepresentationConfig: entityData?.LeadRepresentationConfig
  };
};
