import { FeatureRestrictionConfigMap } from 'apps/entity-details/types/entity-data.types';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from '../utils/feature-restriction/feature-restriction.types';
import { CallerSource } from '../utils/rest-client';
import { EntityType } from '../types';
import { OPP_CONFIGURATION } from 'apps/entity-details/constants';

const LEAD_FEATURE_RESTRICTION_MAP: FeatureRestrictionConfigMap = {
  addNewTab: {
    moduleName: FeatureRestrictionModuleTypes.LeadDetails,
    actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.LeadDetails].AddNewTab,
    callerSource: CallerSource?.LeadDetails
  },
  manageTabs: {
    moduleName: FeatureRestrictionModuleTypes.LeadDetails,
    actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.LeadDetails].ManageTabs,
    callerSource: CallerSource?.LeadDetails
  },
  edit: {
    moduleName: FeatureRestrictionModuleTypes.LeadDetails,
    actionName: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.LeadDetails].EditLead,
    callerSource: CallerSource?.LeadDetails
  }
};

const OPPORTUNITY_FEATURE_RESTRICTION_MAP: FeatureRestrictionConfigMap = {
  addNewTab: {
    ...OPP_CONFIGURATION,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.OpportunityDetails].AddNewTab
  },
  manageTabs: {
    ...OPP_CONFIGURATION,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.OpportunityDetails].ManageTabs
  },
  edit: {
    ...OPP_CONFIGURATION,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.OpportunityDetails]
        .EditOpportunity
  }
};

export const ENTITY_FEATURE_RESTRICTION_CONFIG_MAP: Record<string, FeatureRestrictionConfigMap> = {
  [EntityType.Lead]: LEAD_FEATURE_RESTRICTION_MAP,
  [EntityType.Opportunity]: OPPORTUNITY_FEATURE_RESTRICTION_MAP
};
