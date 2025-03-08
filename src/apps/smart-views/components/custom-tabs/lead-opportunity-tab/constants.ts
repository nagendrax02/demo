import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  ManageFilters,
  SelectColumn
} from 'apps/smart-views/constants/constants';
import { IFilterData } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { FilterRenderType } from 'apps/smart-views/components/smartview-tab/components/filter-renderer/constants';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';

export const LEAD_OPPORTUNITY_TAB_ID = 'lead-opportunity-tab';

export const DEFAULT_COLUMNS = [
  'mx_Custom_1',
  'Owner',
  'Status',
  'mx_Custom_2',
  'mx_Custom_6',
  'mx_Custom_8'
];

export const DEFAULT_FILTERS = ['Status', 'mx_Custom_2', 'Owner'];

export const DEFAULT_SORT_ON = 'CreatedOn-desc';

export const LEAD_OPP_SCHEMA_NAMES = {
  OPPORTUNITY_TYPE: 'opportunity_type',
  STATUS: 'Status',
  STAGE: 'mx_Custom_2',
  OPPORTUNITY_NAME: 'mx_Custom_1'
};

export const DEFAULT_OPP_TYPE_OPTION = { label: 'Any Opportunity', value: '-1' };

export const ANY_OPPORTUNITY = '-1';

export const DEFAULT_OPP_TYPE_FILTER_CONFIG: IFilterData = {
  selectedValue: [],
  value: '',
  label: 'Opportunity Type',
  entityType: ConditionEntityType.Opportunity,
  filterOperator: ConditionOperator.EQUALS,
  filterOperatorType: ConditionOperatorType.MultiSelect,
  renderType: FilterRenderType.OppType,
  excludeFromApi: true,
  defaultOption: { selectedValue: [DEFAULT_OPP_TYPE_OPTION], value: DEFAULT_OPP_TYPE_OPTION.value }
};
export const LEAD_OPP_TAB_HEADER_ACTION_FEATURE_RESTRICTION_MAP: Record<string, string> = {
  [ManageFilters]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].ManageFilters,
  [SelectColumn]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].SelectColumn
};
