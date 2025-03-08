import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';
import { FeatureRestrictionConfigMap } from 'apps/entity-details/types/entity-data.types';

export const leadFeatureRestrictionConfigMap: FeatureRestrictionConfigMap = {
  Edit: {
    actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.LeadDetails].EditLead,
    moduleName: FeatureRestrictionModuleTypes.LeadDetails,
    callerSource: CallerSource?.LeadDetailsVCard
  }
};
