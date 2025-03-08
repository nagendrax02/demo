import { FeatureRestrictionConfigMap } from 'apps/entity-details/types/entity-data.types';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';

export const QUICK_ADD_FEATURE_RESTRICTION_MAP: FeatureRestrictionConfigMap = {
  AddNewLead: {
    moduleName: FeatureRestrictionModuleTypes.Navigation_GlobalAdd,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.Navigation_GlobalAdd]
        .GlobalAddLead,
    callerSource: CallerSource.MarvinHeader
  },
  Activity: {
    moduleName: FeatureRestrictionModuleTypes.Navigation_GlobalAdd,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.Navigation_GlobalAdd]
        .GlobalAddActivity,
    callerSource: CallerSource.MarvinHeader
  },
  CreateTask: {
    moduleName: FeatureRestrictionModuleTypes.Navigation_GlobalAdd,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.Navigation_GlobalAdd]
        .GlobalAddTask,
    callerSource: CallerSource.MarvinHeader
  },
  AddOpportunity: {
    moduleName: FeatureRestrictionModuleTypes.Navigation_GlobalAdd,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.Navigation_GlobalAdd]
        .GlobalAddOpportunity,
    callerSource: CallerSource.MarvinHeader
  }
};
