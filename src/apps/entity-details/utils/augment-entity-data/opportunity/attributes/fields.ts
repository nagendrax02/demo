import { IOpportunity } from 'common/types';
import { getLeadName } from '../utils';

const getOpportunityFields = (entityData: IOpportunity): Record<string, string | null> => {
  return {
    ...entityData?.details?.Fields,
    CanUpdate: 'true',
    RelatedLead: getLeadName(entityData?.details?.AssociatedLeadData?.details?.Fields),
    DoNotEmail: entityData?.details?.AssociatedLeadData?.details?.Fields?.DoNotEmail || null,
    DoNotCall: entityData?.details?.AssociatedLeadData?.details?.Fields?.DoNotCall || null
  };
};

export { getOpportunityFields };
