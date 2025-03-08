import { EntityType, IEntity, IOpportunity } from 'common/types';
import { ErrorMessages } from '../error-page/utils';

const opportunityResponseValidator = (data: IEntity): void => {
  if (
    !Object.keys(data?.details?.Fields || {})?.length ||
    !(data as IOpportunity)?.details?.EventCode
  ) {
    throw new Error(ErrorMessages.permission);
  }
};

const responseValidatorMap: Record<string, (data: IEntity) => void> = {
  [EntityType.Opportunity]: opportunityResponseValidator
};

export const validateResponse = (type: EntityType, data: IEntity): void => {
  if (responseValidatorMap?.[type]) {
    responseValidatorMap?.[type](data);
  }
};
