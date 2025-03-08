import { ErrorMessages } from './constants';
import { ITicket } from './augmentation/ticket/ticket.types';
import { IEntityProperty } from 'src/common/types/entity/lead/metadata.types';

export const getErrorConfig = (error: Error): string => {
  switch (error?.message) {
    case ErrorMessages.invalidEntityId:
    case ErrorMessages.invalidGuid:
      return 'Lead with specified Id does not exist in the system';
    case ErrorMessages.permission:
      return 'You do not have sufficient permission to access this page, Please contact your Administrator.';
    case ErrorMessages.invalidAccountEntity:
      return 'The company type you sent was either not found or deleted.';
    case ErrorMessages.invalidOpportunityEntity:
      return 'Opportunity with specified Id does not exist in the system';
    default:
      return '';
  }
};

export const updateProperties = (
  properties: IEntityProperty[],
  data: ITicket
): IEntityProperty[] => {
  if (!properties || properties.length === 0) {
    return [];
  }
  return properties?.map((property: IEntityProperty) => {
    const dataValue: string = data[property?.schemaName] as string;
    return {
      ...property,
      value: dataValue
    };
  });
};
