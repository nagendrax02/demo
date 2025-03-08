import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { IGetName } from './field-renderer.type';

const getName = (props: IGetName): string => {
  const { property, fields } = props;
  const userFields = {
    CreatedByName: 'CreatedByName',
    ModifiedByName: 'ModifiedByName'
  };

  if (userFields[property?.schemaName]) {
    return property?.value;
  }
  return fields?.Value || '';
};

export const getUserName = (
  property: IEntityProperty,
  fields?: Record<string, string | null>
): string | undefined => {
  if (property.doNotUseNameAsValue) return undefined;
  return property.isRenderedInGrid ? property.name : getName({ property, fields });
};
