/* eslint-disable @typescript-eslint/naming-convention */
import { IColumn } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { workAreaIds } from 'common/utils/process/constant';
import AssociatedEntity from 'apps/smart-views/components/cell-renderers/associated-entity';
import cellRendererStyle from 'apps/smart-views/components/cell-renderers/cell-renderer.module.css';
import RowActions from 'apps/smart-views/components/cell-renderers/row-actions/RowActions';
import { ACTION } from 'apps/entity-details/constants';
import { IActionConfig } from 'apps/entity-details/types';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { DataType } from 'common/types/entity/lead';
import { handleDeleteActivity } from './helpers';
import OpportunityIdentifier from 'apps/smart-views/components/cell-renderers/OpportunityIdentifier';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { ManageFilters, SelectColumn } from '../../constants/constants';
import { ASSOCIATED_TO } from '../common-utilities/constant';

export const customColumnDefs: Record<string, IColumn> = {
  LeadIdentifier: {
    id: 'LeadIdentifier',
    displayName: ASSOCIATED_TO,
    sortable: false,
    resizable: true,
    sortKey: 'FirstName',
    width: 220,
    minWidth: 220,
    CellRenderer: AssociatedEntity
  },
  mx_Custom_1: {
    id: 'mx_Custom_1',
    displayName: 'Opportunity Name',
    sortable: true,
    resizable: true,
    width: 220,
    minWidth: 220,
    CellRenderer: OpportunityIdentifier
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

export const leadInfoColumns =
  'P_ProspectStage,P_mx_City,P_PhotoUrl,P_mx_State,P_mx_Country,P_DoNotEmail,P_DoNotCall';

export const actionKeys = {
  edit: '101',
  addActivity: '105',
  addTask: '104',
  delete: '103'
};

export const defaultQuickActions = [actionKeys.edit, actionKeys.addActivity, actionKeys.addTask];

export const rowActions: IActionConfig[] = [
  {
    key: actionKeys.edit,
    id: ACTION.OpportunityAttributeDetailsEdit,
    title: 'Edit',
    toolTip: 'Edit',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.OPPORTUNITY_TAB.EDIT
    },
    actionHandler: {}
  },
  {
    key: actionKeys.addActivity,
    id: ACTION.OpportunityAddActivity,
    title: 'Add Activity',
    toolTip: 'Add Activity',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.OPPORTUNITY_TAB.ADD_ACTIVITY
    },
    actionHandler: {}
  },
  {
    key: actionKeys.addTask,
    id: ACTION.OpportunityAddTask,
    title: 'Add Task',
    toolTip: 'Add Task',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.OPPORTUNITY_TAB.ADD_TASK
    },
    actionHandler: {}
  },
  {
    key: actionKeys.delete,
    id: ACTION.Delete,
    title: 'Delete',
    toolTip: 'Delete',
    disabled: false,
    actionHandler: {
      getTitle: () => 'Delete Opportunity',
      getDescription: () =>
        'Are you sure you want to delete the selected Opportunity? All the activities, tasks and notes related to this Opportunity will also be deleted. This action cannot be undone.',
      handleDelete: (customConfig) => handleDeleteActivity(customConfig)
    }
  }
];

export const BulkActionKeys = {
  BulkUpdate: '1',
  AddActivity: '7',
  BulkDelete: '6',
  ChangeStatusStage: '9'
};

export const ActivityCodes = {
  SALES_ACTIVITY: '30',
  CANCELLED_SALES_ACTIVITY: '31',
  INBOUND_PHONE_CALL_ACTIVITY: '21',
  OUTBOUND_PHONE_CALL_ACTIVITY: '22',
  SMS_SEND_ACTIVITY: '355',
  SMS_RECEIVED_ACTIVITY: '211',
  PORTAL_PUBLISHER_TRACKING_EVENT_CONSTANTS: '11001',
  PORTAL_REGISTRATION_CONSTANTS: '91',
  LOGGED_INTO_PORTAL: '93',
  LOGGED_OUT_PORTAL: '96'
};

export const allowedActivityActions: Record<
  string,
  { ActivityName: string; allowedRowActions: string[] }
> = {
  103: {
    ActivityName: 'Had a phone conversation',
    allowedRowActions: [actionKeys.delete, actionKeys.edit]
  },
  355: {
    ActivityName: 'SMS Sent',
    allowedRowActions: [actionKeys.edit]
  },
  211: {
    ActivityName: 'SMS Received',
    allowedRowActions: [actionKeys.edit]
  },
  11001: {
    ActivityName: 'Publisher Tracking',
    allowedRowActions: []
  },
  91: {
    ActivityName: 'Registered for Portal',
    allowedRowActions: []
  },
  93: {
    ActivityName: 'Logged into Portal',
    allowedRowActions: []
  },
  96: {
    ActivityName: 'Logged out of Portal',
    allowedRowActions: []
  },
  98: {
    ActivityName: 'Payment Via Forms',
    allowedRowActions: [actionKeys.edit]
  },
  31: {
    ActivityName: 'Cancel Sales Activity',
    allowedRowActions: []
  }
};

export const opportunityBulkActions: IMenuItem[] = [
  {
    label: 'Bulk Update',
    value: BulkActionKeys.BulkUpdate,
    id: ACTION.BulkUpdate
  },
  {
    label: 'Bulk Delete',
    value: BulkActionKeys.BulkDelete,
    id: ACTION.OpportunityBulkDelete
  },
  {
    label: 'Add Activity',
    value: BulkActionKeys.AddActivity,
    id: ACTION.AddActivity
  },
  {
    label: 'Change Status/Stage',
    value: BulkActionKeys.ChangeStatusStage,
    id: ACTION.Change_Status_Stage
  }
];

export const leadDateTypeFilterMap = {
  ['0']: 'ProspectActivityDate_Max',
  ['1']: 'CreatedOn',
  ['2']: 'ModifiedOn'
};

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

export const OpportunityDefaultFilters = [
  'P_ProspectStage',
  'Status',
  'mx_Custom_2',
  'mx_Custom_10',
  'Owner',
  'P_Groups'
];

export const ACTIVITY_DATE_TYPE_FILTER = {
  ActivityCreatedOn: 'PACreatedOn',
  ActivityModifiedOn: 'PAModifiedOn'
};

export const CAN_PREFIX_LEAD_REP_NAME = {
  OwnerId: 'OwnerId',
  OwnerIdName: 'OwnerIdName',
  CreatedOn: 'CreatedOn',
  CreatedBy: 'CreatedBy',
  CreatedByName: 'CreatedByName',
  ModifiedOn: 'ModifiedOn',
  ModifiedBy: 'ModifiedBy',
  ModifiedByName: 'ModifiedByName',
  Notes: 'Notes'
};

export const UPDATE_DISPLAY_NAME = {
  [ACTIVITY_DATE_TYPE_FILTER.ActivityModifiedOn]: 'Activity Modified On',
  PACreatedByName: 'Activity Added By'
};

export const REDUNDANT_SCHEMAS: Record<string, string[]> = {
  '91': ['mx_Custom_4', 'mx_Custom_3', 'mx_Custom_1', 'mx_Custom_2', 'mx_Custom_5'],
  '98': ['mx_Custom_6', 'mx_Custom_7', 'mx_Custom_8']
};

export const leadSchemaNamePrefix = 'P_';

export const OWNER_DROPDOWN_SCHEMA = {
  OwnerId: 'OwnerId',
  [`${leadSchemaNamePrefix}OwnerId`]: `${leadSchemaNamePrefix}OwnerId`,
  Owner: 'Owner',
  PACreatedByName: 'PACreatedByName'
};

export const SALES_ACTIVITY = '30';

export const nonSortableFields = {
  PACreatedByName: true,
  ActivityEvent_Note: true,
  ProspectActivityId: true,
  mx_Custom_4: true,
  OpportunityAge: true,
  mx_Custom_8: true,
  mx_Custom_1: true
};

export const replaceableSchema: Record<string, string> = {
  [ACTIVITY_DATE_TYPE_FILTER.ActivityCreatedOn]: 'CreatedOn',
  [ACTIVITY_DATE_TYPE_FILTER.ActivityModifiedOn]: 'ModifiedOn',
  PACreatedByName: 'CreatedBy'
};

export const ActivityManageFilterConfig = {
  allowedDataType: {
    [DataType.Dropdown]: 1,
    [DataType.SearchableDropdown]: 1,
    [DataType.Date]: 1,
    [DataType.DateTime]: 1,
    [DataType.ActiveUsers]: 1,
    [DataType.LargeOptionSet]: 1,
    [DataType.Product]: 1,
    [DataType.Lead]: 1
  },
  disallowedFilter: {
    LastRelatedActivityName: 1,
    LastRelatedActivityDate: 1
  }
};

export const PlatformSettingsSchemaMap: Record<string, string> = {
  P_ProspectStage: 'Stage',
  Status: 'Status',
  mx_Custom_2: 'OpportunityStage',
  mx_Custom_10: 'ProductCode',
  Owner: 'Owner',
  CreatedBy: 'CreatedBy'
};

export const OnResetFilters = [...OpportunityDefaultFilters, 'mx_Custom_9'];

export const CanAddSourcePrefix = {
  ['mx_Custom_20']: 1,
  ['mx_Custom_21']: 1,
  ['mx_Custom_22']: 1,
  ['mx_Custom_23']: 1
};

export const OPP_SCHEMA_NAMES = {
  Source: 'mx_Custom_3',
  Product: 'mx_Custom_10'
};
const OpportunityAddNewLead = 'opportunity_add_new_lead';

export const OPPORTUNITY_HEADER_MENU_FEATURE_RESTRICTION_MAP: Record<string, string> = {
  [OpportunityAddNewLead]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].AddNewLead,
  [ManageFilters]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].ManageFilters,
  [SelectColumn]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].SelectColumn
};
