import {
  CalendarView,
  IColumn,
  TabView
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import CellRenderer from 'apps/smart-views/components/cell-renderers/CellRenderer';
import cellRendererStyle from 'apps/smart-views/components/cell-renderers/cell-renderer.module.css';
import RowActions from 'src/apps/smart-views/components/cell-renderers/row-actions/RowActions';
import { workAreaIds } from 'common/utils/process/constant';
import { ACTION } from 'apps/entity-details/constants';
import { IActionConfig } from 'apps/entity-details/types';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { DataType, RenderType } from 'common/types/entity/lead/metadata.types';
import { ManageFilters, SCHEMA_NAMES, SelectColumn } from '../../constants/constants';
import TaskStatus from '../../components/cell-renderers/task-status';
import TaskReminder from '../../components/cell-renderers/TaskReminder';
import TaskSubject from '../../components/cell-renderers/task-subject';
import {
  ITaskMetadataMap,
  TaskAttributeDataType,
  TaskAttributeRenderType
} from 'common/types/entity/task/metadata.types';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';

// schemaNames which are same between lead and tasks
export const RedundentLeadSchemaNames = {
  CreatedOn: 'CreatedOn',
  CreatedBy: 'CreatedBy',
  CreatedByName: 'CreatedByName',
  ModifiedOn: 'ModifiedOn',
  ModifiedBy: 'ModifiedBy',
  ModifiedByName: 'ModifiedByName',
  Notes: 'Notes'
};

export const SortingSchema = {
  [SCHEMA_NAMES.CREATED_BY]: SCHEMA_NAMES.CREATED_BY_NAME,
  [SCHEMA_NAMES.OWNER_ID]: SCHEMA_NAMES.OWNER_NAME
};

export const NonSortableFields = {
  CheckBoxColumn: 'CheckBoxColumn',
  UserTaskId: 'UserTaskId',
  StatusCode: 'StatusCode'
};

export const FieldsToChangeDisplayName = {
  Organizer: 'Created By',
  Schedule: 'Due Date',
  Owner: 'Task Owner'
};

export const NotRequiredSchemas = {
  [SCHEMA_NAMES.ASSOCIATED_OPPORTUNITY]: SCHEMA_NAMES.ASSOCIATED_OPPORTUNITY,
  [SCHEMA_NAMES.PERCENT_COMPLETED]: SCHEMA_NAMES.PERCENT_COMPLETED
};

export const customColumnDefs: Record<string, IColumn> = {
  UserTaskAutoId: {
    id: 'UserTaskAutoId',
    displayName: 'Task Id',
    sortable: true,
    resizable: true,
    width: 200,
    minWidth: 120,
    dataType: DataType.Text,
    renderType: RenderType.Text,
    CellRenderer: CellRenderer
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

export const defaultQuickActions = ['201', '203', '14'];

export const taskRowActions: IActionConfig[] = [
  {
    key: '201',
    id: ACTION.EditTask,
    title: 'Edit',
    formTitle: 'Edit Task',
    toolTip: 'Edit',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.TASK_TAB.EDIT
    }
  },
  {
    key: '202',
    id: ACTION.MarkOpen,
    title: 'Mark Open',
    toolTip: 'Mark Open',
    workAreaConfig: {
      workAreaId: workAreaIds.NA
    }
  },
  {
    key: '203',
    id: ACTION.MarkComplete,
    title: 'Mark Complete',
    toolTip: 'Mark Complete',
    workAreaConfig: {
      workAreaId: workAreaIds.NA
    }
  },
  {
    key: '204',
    id: ACTION.TaskDelete,
    title: 'Task Delete',
    toolTip: 'Task Delete',
    actionHandler: {}
  },
  {
    key: '205',
    id: ACTION.DeleteRecurrence,
    title: 'Delete Recurrence',
    toolTip: 'Delete Recurrence'
  },
  {
    key: '206',
    id: ACTION.TaskCancel,
    title: 'Cancel',
    toolTip: 'Cancel'
  },
  {
    key: '1',
    id: ACTION.Edit,
    title: 'Edit Lead',
    toolTip: 'Edit Lead',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.TASK_TAB.EDIT_LEAD
    }
  },
  {
    key: '4',
    id: ACTION.AddTaskForLead,
    title: 'Add Task For Lead',
    toolTip: 'Add Task For Lead',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.TASK_TAB.ADD_TASK_FOR_LEAD
    }
  },
  {
    key: '5',
    id: ACTION.AddActivityForLead,
    title: 'Add Activity For Lead',
    toolTip: 'Add Activity For Lead',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.TASK_TAB.ADD_ACTIVITY_FOR_LEAD
    }
  },
  {
    key: '6',
    id: ACTION.SendEmailAction,
    title: 'Send Email',
    toolTip: 'Send Email'
  },
  {
    key: '7',
    id: ACTION.ChangeOwner,
    title: 'Change Lead Owner',
    toolTip: 'Change Lead Owner'
  },
  {
    key: '8',
    id: ACTION.ChangeStage,
    title: 'Change Lead Stage',
    toolTip: 'Change Lead Stage'
  },
  {
    key: '13',
    id: ACTION.Delete,
    title: 'Lead Delete',
    toolTip: 'Lead Delete'
  },
  {
    key: '14',
    id: ACTION.Call,
    title: 'Call',
    toolTip: 'Call'
  },
  {
    key: '18',
    id: ACTION.Converse,
    title: 'Converse',
    toolTip: 'Converse'
  }
];

export const RowActionKeys = {
  ChangeOwner: '7',
  ChangeStage: '8',
  Delete: '13',
  MarkComplete: '203',
  MarkOpen: '202',
  EditTask: '201'
};

export const BulkActionKeys = {
  MarkComplete: '1',
  MarkOpen: '2',
  Delete: '6',
  Cancel: '13',
  ChangeTaskOwner: '15'
};

export const taskBulkActions: IMenuItem[] = [
  {
    label: 'Mark Complete',
    value: '1',
    id: ACTION.MarkComplete
  },
  {
    label: 'Mark Open',
    value: '2',
    id: ACTION.MarkOpen
  },
  {
    label: 'Delete',
    value: '6',
    id: ACTION.TaskDelete
  },
  {
    label: 'Cancel',
    value: '13',
    id: ACTION.TaskCancel
  },
  {
    label: 'Change Task Owner',
    value: '15',
    id: ACTION.ChangeTaskOwner
  }
];

export const COLUMN_RENDERER_MAP = {
  [SCHEMA_NAMES.STATUS_CODE]: TaskStatus,
  [SCHEMA_NAMES.REMINDER]: TaskReminder,
  [SCHEMA_NAMES.NAME]: TaskSubject
};

export const LEAD_SCHEMA_NAME = {
  DO_NOT_EMAIL: 'P_DoNotEmail',
  EMAIL_ADDRESS: 'P_EmailAddress'
};

export const TASK_SCHEMA_NAME = {
  STATUS_CODE: 'StatusCode',
  OWNER: 'OwnerId',
  CREATED_BY: ' CreatedBy',
  SCHEDULE: 'DueDate'
};

export const TaskActionIds = {
  CALENDAR_VIEW: 'calendar_view',
  LIST_VIEW: 'list_view',
  CREATE_TASK: 'create_task',
  MORE_ACTIONS: 'more_actions',
  GEAR_ACTIONS: 'gear_actions'
};

export const defaultTaskColumns =
  'Name,UserTaskAutoId,StatusCode,DueDate,Reminder,CreatedBy,OwnerId';

export const defaultManageTaskColumns =
  'Name,UserTaskAutoId,RelatedEntityId,StatusCode,DueDate,Reminder,CreatedBy,OwnerId';

export const TASK_RENDER_TYPE_MAP: Record<string, RenderType> = {
  Textbox: RenderType.Text,
  Text: RenderType.Text,
  Datetime: RenderType.DateTime,
  Date: RenderType.Datetime
};

export const defaultTaskFilters = ['TaskType', 'status', 'OwnerId', 'DueDate'];

export const taskDateTypeFilterMap = {
  Schedule: 'DueDate',
  CompletedOn: 'EndDate'
};

export const PlatformSettingsTaskSchemaMap = {
  TaskType: 'Filters_TaskTypeFilter',
  status: 'StatusFilter',
  OwnerId: 'OwnerFilter',
  DueDate: 'Schedule',
  EndDate: 'CompletedOn'
};

export const customFormedInlineTaskMetadata: ITaskMetadataMap = {
  StatusCode: {
    DisplayName: 'Status',
    SchemaName: 'StatusCode',
    DataType: TaskAttributeDataType.Text,
    RenderType: TaskAttributeRenderType.TextArea
  },
  UserTaskAutoId: {
    DisplayName: 'Task Id',
    SchemaName: 'UserTaskAutoId',
    DataType: TaskAttributeDataType.Text,
    RenderType: TaskAttributeRenderType.TextArea
  },
  CompletedOn: {
    DisplayName: 'Completed On',
    SchemaName: 'CompletedOn',
    DataType: TaskAttributeDataType.Text,
    RenderType: TaskAttributeRenderType.Datetime
  },
  CreatedOn: {
    DisplayName: 'Created On',
    SchemaName: 'CreatedOn',
    DataType: TaskAttributeDataType.Date,
    RenderType: TaskAttributeRenderType.Datetime
  },
  ModifiedBy: {
    DisplayName: 'Modified By',
    SchemaName: 'ModifiedBy',
    DataType: TaskAttributeDataType.Text,
    RenderType: TaskAttributeRenderType.TextArea
  },
  ModifiedOn: {
    DisplayName: 'Modified On',
    SchemaName: 'ModifiedOn',
    DataType: TaskAttributeDataType.Date,
    RenderType: TaskAttributeRenderType.Datetime
  }
};

export const PlatformSettingsCalendarSchemaMap = {
  TaskType: 'Filters_TaskTypeFilter_Calendar',
  status: 'StatusFilter_calendar',
  OwnerId: 'MultiOwnerFilter_calendar'
  // Groups: 'SalesGroup_Calendar' --> uncomment when sales group fetch api accepts searchByValue
};

export const PlatformSettingsDateMap = {
  [PlatformSettingsTaskSchemaMap.DueDate]: {
    value: 'SelectedDateRangeOption',
    from: 'TaskDateFrom',
    to: 'TaskDateTo'
  },
  [PlatformSettingsTaskSchemaMap.EndDate]: {
    value: 'SelectedCompletedOnDateRangeOption',
    from: 'CompletedOnDateFrom',
    to: 'CompletedOnDateTo'
  }
};

export const PlatformSettingsLeadSchemaMap = {
  ProspectStage: 'Stage',
  OwnerId: 'LeadOwner',
  Source: 'Source',
  // Groups: 'SalesGroup', --> uncomment when sales group fetch api accepts searchByValue
  TimeZone: 'TimeZone',
  CurrentOptInStatus: 'CurrentOptInStatus'
};

export const DefaultFilterValue = {
  NO_SELECT_OPTIONS: ['any', 'all', 'any product', 'any - product', 'alltasks', '-1'],
  CURRENT_USER: '__mx_current_user__',
  ALL_TASK_TYPE_VALUE: '-1'
};

export const TASK_VIEW = {
  CALENDAR: 'calendar',
  GRID: 'grid'
};

export const notAllowedLeadFilters = {
  ['ProspectActivityDate_Min']: 'ProspectActivityDate_Min',
  FirstLandingPageSubmissionDate: 'FirstLandingPageSubmissionDate',
  ['ProspectActivityName_Max']: 'ProspectActivityName_Max',
  ['ProspectActivityDate_Max']: 'ProspectActivityDate_Max',
  LastOptInEmailSentDate: 'LastOptInEmailSentDate',
  NotableEventdate: 'NotableEventdate',
  LastVisitDate: 'LastVisitDate',
  OptInDate: 'OptInDate',
  LeadConversionDate: 'LeadConversionDate',
  LeadLastModifiedOn: 'LeadLastModifiedOn'
};

export const notAllowedTaskFilters = {
  EffortEstimateUnit: 'EffortEstimateUnit',
  RelatedEntityId: 'RelatedEntityId',
  RelatedOpportunityId: 'RelatedOpportunityId'
};

export const notAllowedTaskColumns = {
  TaskType: 'TaskType',
  status: 'status',
  EffortEstimateUnit: 'EffortEstimateUnit',
  EffortEstimate: 'EffortEstimate'
};

export const allowedLeadFilterDataTypes = [DataType.Select, DataType.Date, DataType.MultiSelect];

export const allowedTaskFilterDataTypes = [
  TaskAttributeDataType.Select,
  TaskAttributeDataType.Date,
  TaskAttributeDataType.MultiSelect
];

export const TASK_ACTION_KEYS = ['201', '202', '203', '204', '205', '206', '300'];

export const STATUS_CODE = {
  Pending: 0,
  Complete: 1,
  Cancelled: 2
};

export const TASK_ACTION_CATEGORY = {
  TASK_ACTION: 'Task_Action',
  LEAD_ACTION: 'Lead_Action'
};

export const TAB_VIEW_MAP = {
  list: TabView.List,
  calendar: TabView.CalendarView
};

export const TAB_VIEW_MAP_REVERSE = {
  [TabView.List]: 'List',
  [TabView.CalendarView]: 'calendar'
};

export const CALENDAR_VIEW_MAP_CACHE = {
  resourceTimeGridDay: CalendarView.Day,
  timeGridWeek: CalendarView.Week,
  dayGridMonth: CalendarView.Month
};

export const CALENDAR_VIEW_MAP_CACHE_REVERSE = {
  [CalendarView.Day]: 'resourceTimeGridDay',
  [CalendarView.Week]: 'timeGridWeek',
  [CalendarView.Month]: 'dayGridMonth'
};

export const CALENDAR_VIEW_MAP_PLATFORM = {
  agendaDay: CalendarView.Day,
  agendaWeek: CalendarView.Week,
  agendaWorkweek: CalendarView.Week,
  month: CalendarView.Month
};

export const INVALID_DATE_VALUE = '1/1/0001 12:00:00 AM';

export const TASK_HEADER_MENU_FEATURE_RESTRICTION_MAP: Record<string, string> = {
  [ManageFilters]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].ManageFilters,
  [SelectColumn]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].SelectColumn
};

export const TASK_TAB_RENDER_TYPE_MAP: Record<string, RenderType> = {
  Email: RenderType.Text
};
