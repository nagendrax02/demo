/* eslint-disable @typescript-eslint/naming-convention */
import {
  IBulkAction,
  IColumn,
  IRecordType
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import cellRendererStyle from 'apps/smart-views/components/cell-renderers/cell-renderer.module.css';
import { workAreaIds } from 'common/utils/process/constant';
import { LeadIdentifier } from 'apps/smart-views/components/cell-renderers/LeadIdentifier';
import RowActions from 'src/apps/smart-views/components/cell-renderers/row-actions/RowActions';
import { ACTION } from 'apps/entity-details/constants';
import { IActionConfig } from 'apps/entity-details/types';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { TABS_CACHE_KEYS } from '../../components/custom-tabs/constants';
import NeutralBadge from '../../components/cell-renderers/NeutralBadge';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { ManageFilters, SCHEMA_NAMES, SelectColumn } from '../../constants/constants';
import { getRemoveFromListActionHandler } from './helpers';

export const customColumnDefs: Record<string, IColumn> = {
  LeadIdentifier: {
    id: 'LeadIdentifier',
    displayName: 'Lead Name',
    sortable: true,
    resizable: true,
    sortKey: 'LeadIdentifier',
    width: 150,
    minWidth: 150,
    CellRenderer: (props) => <LeadIdentifier {...props} />
  },
  Actions: {
    id: 'Actions',
    displayName: 'Actions',
    sortable: false,
    resizable: false,
    width: 160,
    minWidth: 160,
    CellRenderer: RowActions,
    customHeaderCellStyle: cellRendererStyle.action_header_style
  }
};

export const LeadActionIds = {
  MORE_ACTIONS: 'more_actions',
  GEAR_ACTIONS: 'gear_actions'
};

export const defaultQuickActions = ['4', '6', '14'];

export const leadRowActions: IActionConfig[] = [
  {
    key: '1',
    id: ACTION.Edit,
    title: 'Edit',
    toolTip: 'Edit',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.LEAD_TAB.EDIT
    },
    actionHandler: {}
  },
  {
    key: '3',
    id: ACTION.SalesActivity,
    title: 'New Sales Activity',
    toolTip: 'New Sales Activity',
    workAreaConfig: {
      workAreaId: workAreaIds.NA
    },
    actionHandler: {}
  },
  {
    key: '4',
    id: ACTION.Tasks,
    title: 'Add Task',
    toolTip: 'Add Task',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.LEAD_TAB.ADD_TASK
    },
    actionHandler: {}
  },
  {
    key: '5',
    id: ACTION.Activity,
    title: 'Add Activity',
    toolTip: 'Add Activity',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.LEAD_TAB.ADD_ACTIVITY
    },
    actionHandler: {}
  },
  {
    key: '6',
    id: ACTION.SendEmailAction,
    title: 'Send Email',
    toolTip: 'Send Email',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '7',
    id: ACTION.ChangeOwner,
    title: 'Change Owner',
    toolTip: 'Change Owner',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '8',
    id: ACTION.ChangeStage,
    title: 'Change Stage',
    toolTip: 'Change Stage',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '9',
    id: ACTION.SetAsPrimaryContact,
    title: 'Set as Primary Contact',
    toolTip: 'Set as Primary Contact',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '12',
    id: ACTION.AddToList,
    title: 'Add To List',
    toolTip: 'Add To List',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '13',
    id: ACTION.Delete,
    title: 'Delete',
    toolTip: 'Delete',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '14',
    id: ACTION.Call,
    title: 'Call',
    toolTip: 'Call',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '18',
    id: ACTION.Converse,
    title: 'Converse',
    toolTip: 'Converse',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '19',
    id: ACTION.Opportunity,
    title: 'Add Opportunity',
    toolTip: 'Add Opportunity',
    workAreaConfig: {
      workAreaId: workAreaIds.NA
    },
    actionHandler: {}
  },
  {
    key: '16',
    id: ACTION.ShareViaEmail,
    title: 'Share via Email',
    toolTip: 'Share via Email',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '101',
    id: ACTION.RemoveFromList,
    title: 'Remove From List',
    toolTip: 'Remove From List',
    disabled: false,
    actionHandler: {}
  }
];

export const manageLeadRowActions: IActionConfig[] = [
  {
    key: '1',
    id: ACTION.Edit,
    title: 'Edit',
    toolTip: 'Edit',
    workAreaConfig: {
      workAreaId: workAreaIds.MANAGE_LEADS.EDIT
    },
    actionHandler: {}
  },
  {
    key: '3',
    id: ACTION.SalesActivity,
    title: 'New Sales Activity',
    toolTip: 'New Sales Activity',
    workAreaConfig: {
      workAreaId: workAreaIds.NA
    },
    actionHandler: {}
  },
  {
    key: '4',
    id: ACTION.Tasks,
    title: 'Add Task',
    toolTip: 'Add Task',
    workAreaConfig: {
      workAreaId: workAreaIds.MANAGE_LEADS.ADD_TASK
    },
    actionHandler: {}
  },
  {
    key: '5',
    id: ACTION.Activity,
    title: 'Add Activity',
    toolTip: 'Add Activity',
    workAreaConfig: {
      workAreaId: workAreaIds.MANAGE_LEADS.ADD_ACTIVITY
    },
    actionHandler: {}
  },
  {
    key: '6',
    id: ACTION.SendEmailAction,
    title: 'Send Email',
    toolTip: 'Send Email',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '7',
    id: ACTION.ChangeOwner,
    title: 'Change Owner',
    toolTip: 'Change Owner',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '8',
    id: ACTION.ChangeStage,
    title: 'Change Stage',
    toolTip: 'Change Stage',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '9',
    id: ACTION.SetAsPrimaryContact,
    title: 'Set as Primary Contact',
    toolTip: 'Set as Primary Contact',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '12',
    id: ACTION.AddToList,
    title: 'Add To List',
    toolTip: 'Add To List',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '13',
    id: ACTION.Delete,
    title: 'Delete',
    toolTip: 'Delete',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '14',
    id: ACTION.Call,
    title: 'Call',
    toolTip: 'Call',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '18',
    id: ACTION.Converse,
    title: 'Converse',
    toolTip: 'Converse',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '19',
    id: ACTION.Opportunity,
    title: 'Add Opportunity',
    toolTip: 'Add Opportunity',
    workAreaConfig: {
      workAreaId: workAreaIds.NA
    },
    actionHandler: {}
  },
  {
    key: '16',
    id: ACTION.ShareViaEmail,
    title: 'Share via Email',
    toolTip: 'Share via Email',
    disabled: false,
    actionHandler: {}
  },
  {
    key: '101',
    id: ACTION.RemoveFromList,
    title: 'Remove From List',
    toolTip: 'Remove From List',
    disabled: false,
    actionHandler: getRemoveFromListActionHandler?.()
  }
];

export const RowActionKeys = {
  AddOpportunity: '19',
  ChangeOwner: '7',
  ChangeStage: '8',
  Delete: '13',
  SetAsPrimaryContact: '9'
};

// These actions will be hidden till functionality is implemented.
export const defaultHiddenActions = [ACTION.RemoveFromList];

export const BulkActionKeys = {
  BulkUpdate: '13',
  SendEmail: '6',
  AddActivity: '15',
  AddOpportunity: '16',
  ChangeOwner: '17',
  ChangeStage: '18',
  Delete: '19',
  MergeLeads: '104'
};

export const leadBulkActions: IMenuItem[] = [
  {
    label: 'Bulk Update',
    value: '13',
    id: ACTION.BulkUpdate,
    canPerformAction: ({ bulkAction }: { bulkAction: IBulkAction }): boolean => {
      return Object.values(bulkAction?.selectedRows).some(
        (config: IRecordType) => config.CanUpdate === 'false'
      );
    }
  },
  {
    label: 'Send Email',
    value: '6',
    id: ACTION.SendEmail
  },
  {
    label: 'Add Activity',
    value: '15',
    workAreaConfig: {
      workAreaId: workAreaIds.NA,
      additionalData: ''
    },
    id: ACTION.AddActivity
  },
  {
    label: 'Add Opportunity',
    value: '16',
    workAreaConfig: {
      workAreaId: workAreaIds.NA,
      additionalData: ''
    },
    id: ACTION.AddOpportunity
  },
  {
    label: 'Add to List',
    value: '102',
    id: ACTION.AddToList
  },
  {
    label: 'Change Owner',
    value: '17',
    id: ACTION.ChangeOwner
  },
  {
    label: 'Change Stage',
    value: '18',
    id: ACTION.ChangeStage
  },
  {
    label: 'Delete',
    value: '19',
    id: ACTION.Delete
  },
  {
    label: 'Merge Leads',
    value: '104',
    id: ACTION.MergeLeads
  },
  {
    value: '101',
    id: ACTION.RemoveFromList,
    label: 'Remove From List',
    toolTip: 'Remove From List',
    disabled: false,
    actionHandler: getRemoveFromListActionHandler?.()
  }
];

export const notAllowedFilters = {
  ProspectActivityDate_Min: 'ProspectActivityDate_Min',
  FirstLandingPageSubmissionDate: 'FirstLandingPageSubmissionDate',
  ProspectActivityName_Max: 'ProspectActivityName_Max',
  LastOptInEmailSentDate: 'LastOptInEmailSentDate',
  NotableEventdate: 'NotableEventdate',
  LastVisitDate: 'LastVisitDate',
  OptInDate: 'OptInDate',
  LeadConversionDate: 'LeadConversionDate',
  LeadLastModifiedOn: 'LeadLastModifiedOn'
};

export const defaultLeadFilters = [
  'ProspectStage',
  'Source',
  'OwnerId',
  'ProspectActivityDate_Max'
];

export const getDefaultLeadFilters = (tabId?: string): string[] => {
  switch (tabId) {
    case TABS_CACHE_KEYS.LEADS_CACHE_KEY:
    case TABS_CACHE_KEYS.RELATED_LEADS_CACHE_KEY:
      return ['ProspectStage', 'OwnerId'];
  }
  return defaultLeadFilters;
};

export const defaultLeadColumns = 'LeadIdentifier,Score,ProspectStage,OwnerIdName,ModifiedOn';

export const LEAD_FEATURE_RESTRICTION_KEY = {
  AddNewLead: 'add_new_lead',
  ImportLeads: 'import_leads',
  ExportLeads: 'export_leads',
  QuickAddLead: 'quick_add_lead'
};

export const LEAD_HEADER_ACTION_FEATURE_RESTRICTION_MAP: Record<string, string> = {
  [LEAD_FEATURE_RESTRICTION_KEY.AddNewLead]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].AddNewLead,
  [LEAD_FEATURE_RESTRICTION_KEY.ImportLeads]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].ImportLeads,
  [LEAD_FEATURE_RESTRICTION_KEY.ExportLeads]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].ExportLeads,
  [ManageFilters]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].ManageFilters,
  [LEAD_FEATURE_RESTRICTION_KEY.QuickAddLead]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].QuickAddLead,
  [SelectColumn]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].SelectColumn
};

export const COLUMN_RENDERER_MAP = {
  [SCHEMA_NAMES.PROSPECT_STAGE]: NeutralBadge
};
