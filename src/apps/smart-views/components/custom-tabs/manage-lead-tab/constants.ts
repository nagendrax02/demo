import {
  ManageFilters,
  SelectColumn,
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType
} from 'apps/smart-views/constants/constants';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { LEAD_FEATURE_RESTRICTION_KEY } from 'apps/smart-views/augment-tab-data/lead/constants';
import { FilterRenderType } from '../../smartview-tab/components/filter-renderer/constants';

export const DEFAULT_COLUMNS = [
  'LeadIdentifier',
  'Score',
  'ProspectStage',
  'OwnerIdName',
  'ModifiedOn',
  'ProspectID'
];

export const DEFAULT_FILTERS = ['ProspectStage', 'Source', 'OwnerId', 'ProspectActivityDate_Max'];

export const STARRED_LEAD_DEFAULT_FILTERS = [
  'ProspectStage',
  'ProspectActivityDate_Max',
  'CreatedOn',
  'ModifiedOn'
];

export const DEFAULT_SORT_ON = 'CreatedOn-desc';

export const MANAGE_LEAD_FEATURE_RESTRICTION_MAP: Record<string, string> = {
  [SelectColumn]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].SelectColumn,
  [LEAD_FEATURE_RESTRICTION_KEY.AddNewLead]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].AddNewLead,
  [LEAD_FEATURE_RESTRICTION_KEY.ImportLeads]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].ImportLeads,
  [LEAD_FEATURE_RESTRICTION_KEY.ExportLeads]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].ExportLeads,
  [ManageFilters]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].ManageFilters,
  [LEAD_FEATURE_RESTRICTION_KEY.QuickAddLead]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].QuickAddLead
};

export const STARRED_LEADS_FILTERS = {
  selectedFilters: ['ProspectStage', 'ProspectActivityDate_Max', 'CreatedOn', 'ModifiedOn'],
  bySchemaName: {
    ProspectStage: {
      entityType: ConditionEntityType.Lead,
      filterOperator: ConditionOperator.EQUALS,
      filterOperatorType: ConditionOperatorType.PickList,
      label: 'Lead Stage',
      renderType: FilterRenderType.MSWithoutSelectAll,
      selectedValue: [],
      value: '',
      isPinned: true
    },
    ['ProspectActivityDate_Max']: {
      entityType: ConditionEntityType.Lead,
      filterOperator: ConditionOperator.EQUALS,
      filterOperatorType: ConditionOperatorType.DateTime,
      label: 'Last Activity Date',
      renderType: FilterRenderType.DateTime,
      selectedValue: { value: 'all_time', label: 'All Time', startDate: '', endDate: '' },
      value: 'opt-all-time',
      utcDateFormatEnabled: true,
      isPinned: true
    },
    CreatedOn: {
      entityType: ConditionEntityType.Lead,
      filterOperator: ConditionOperator.EQUALS,
      filterOperatorType: ConditionOperatorType.DateTime,
      label: 'Created On',
      renderType: FilterRenderType.DateTime,
      selectedValue: { value: 'all_time', label: 'All Time', startDate: '', endDate: '' },
      value: 'opt-all-time',
      utcDateFormatEnabled: true,
      isPinned: true
    },
    ModifiedOn: {
      entityType: ConditionEntityType.Lead,
      filterOperator: ConditionOperator.EQUALS,
      filterOperatorType: ConditionOperatorType.DateTime,
      label: 'Modified On',
      renderType: FilterRenderType.DateTime,
      selectedValue: { value: 'all_time', label: 'All Time', startDate: '', endDate: '' },
      value: 'opt-all-time',
      utcDateFormatEnabled: true,
      isPinned: true
    }
  }
};
