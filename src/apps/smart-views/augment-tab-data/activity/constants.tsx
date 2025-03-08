/* eslint-disable @typescript-eslint/naming-convention */
import { IColumn } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { workAreaIds } from 'common/utils/process/constant';
import AssociatedEntity from 'apps/smart-views/components/cell-renderers/associated-entity';
import cellRendererStyle from 'apps/smart-views/components/cell-renderers/cell-renderer.module.css';
import RowActions from 'src/apps/smart-views/components/cell-renderers/row-actions/RowActions';
import { ACTION } from 'apps/entity-details/constants';
import { IActionConfig } from 'apps/entity-details/types';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { DataType } from 'common/types/entity/lead';
import { handleDeleteActivity } from './helpers';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import {
  ACTIVITY_DATE_TYPE_FILTER,
  ManageFilters,
  SCHEMA_NAMES,
  SelectColumn
} from '../../constants/constants';
import NeutralBadge from '../../components/cell-renderers/NeutralBadge';
import { ASSOCIATED_TO } from '../common-utilities/constant';
import { Variant } from 'common/types';

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

export const defaultQuickActions = ['101', '102', '103'];

export const leadInfoColumns =
  'P_ProspectStage,P_mx_City,P_PhotoUrl,P_mx_State,P_mx_Country,P_DoNotEmail,P_DoNotCall';

export const actionKeys = {
  edit: '101',
  cancel: '102',
  delete: '103'
};

export const activityRowActions: IActionConfig[] = [
  {
    key: actionKeys.edit,
    id: ACTION.EditActivity,
    title: 'Edit',
    toolTip: 'Edit',
    workAreaConfig: {
      workAreaId: workAreaIds.SMART_VIEWS.ACTIVITY_TAB.EDIT
    },
    actionHandler: {}
  },
  {
    key: actionKeys.cancel,
    id: ACTION.Cancel,
    title: 'Cancel',
    toolTip: 'Cancel',
    actionHandler: {}
  },
  {
    key: actionKeys.delete,
    id: ACTION.Delete,
    title: 'Delete',
    toolTip: 'Delete',
    disabled: false,
    actionHandler: {
      getTitle: () => 'Delete Activity',
      variant: Variant.Error,
      getDescription: () => 'Are you sure you want to delete selected Activity?',
      handleDelete: (customConfig) => handleDeleteActivity(customConfig)
    }
  },
  {
    key: '18',
    id: ACTION.Converse,
    title: 'Converse',
    toolTip: 'Converse',
    disabled: false,
    actionHandler: {}
  }
];

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
  LOGGED_OUT_PORTAL: '96',
  SUBMITTED_FORM_FROM_PORTAL: '92',
  CHANGED_PASSWORD_OF_PORTAL: '94',
  FORGOT_PASSWORD: '95',
  LOGGED_OUT_OF_PORTAL: '96',
  DYNAMIC_FORM_SUBMISSION: '97',
  PAYMENT: '98',
  PUBLISHER_TRACKING: '11001',
  FORM_SUBMITTED_ON_PORTAL: '90',
  SAVE_AS_DRAFT: '21500',
  FORM_SUBMITTED_ON_WIDGET: '21501',
  LANDING_PAGE_PRO_FORM_SUBMISSION: '21502',
  SMART_LINK: '21503',
  DOCUMENT_GENERATION: '21600',
  VISIT_ACTIVITY_ON_LANDING_PAGE: '21000',
  OPPORTUNITY_SHARED_THROUGH_AGENT_POPUP: '36'
};

export const selectedSalesActivity = [
  ActivityCodes.SALES_ACTIVITY,
  ActivityCodes.CANCELLED_SALES_ACTIVITY
];

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

export const activityBulkActions: IMenuItem[] = [
  {
    label: 'Bulk Update',
    value: '13',
    id: ACTION.BulkUpdate
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

export const ActivityStatus = 'Status';
export const ACTIVITY_DEFAULT_FILTERS = ['P_ProspectStage', 'Owner', 'Status'];
export const ACTIVITY_DEFAULT_FILTERS_WITH_DATE = [...ACTIVITY_DEFAULT_FILTERS, 'PACreatedOn'];

export const SALES_ACTIVITY_TAB = {
  ['30']: 'sales-activity-tab',
  ['31']: 'cancel-sales-activity-tab'
};

export const SALES_DEFAULT_FILTER = {
  Product: 'mx_Custom_1',
  Owner: 'mx_Custom_4'
};

export const SALES_ACTIVITY_TAB_DEFAULT_FILTERS = [
  ...ACTIVITY_DEFAULT_FILTERS_WITH_DATE,
  SALES_DEFAULT_FILTER.Product
];

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

export const NOTES_NOT_ALLOWED = {
  30: 'Sales',
  31: 'Cancelled Sales',
  21: 'Inbound Phone Call',
  22: 'Outbound Phone Call',
  91: 'Portal Registeration'
};

export const PORTAL_ENTITY_CODE = {
  '93': 'LoggedIntoPortal',
  '96': 'LoggedOutPortal:'
};
export const leadSchemaNamePrefix = 'P_';

export const OWNER_DROPDOWN_SCHEMA = {
  OwnerId: 'OwnerId',
  [`${leadSchemaNamePrefix}OwnerId`]: `${leadSchemaNamePrefix}OwnerId`,
  Owner: 'Owner',
  PACreatedByName: 'PACreatedByName'
};

export const nonSortableFields = {
  PACreatedByName: true,
  ActivityEvent_Note: true,
  ProspectActivityId: true,
  mx_Custom_4: true,
  OpportunityAge: true,
  mx_Custom_8: true
};

export const nonSortableSalesActivityFields = {
  ...nonSortableFields,
  mx_Custom_1: true
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
  Owner: 'CreatedBy',
  Status: 'Status',
  mx_Custom_1: 'ProductCode',
  mx_Custom_4: 'CreatedBy'
};

export const ACTIVITY_HEADER_MENU_FEATURE_RESTRICTION_MAP: Record<string, string> = {
  [ManageFilters]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].ManageFilters,
  [SelectColumn]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].SelectColumn
};

export const COLUMN_RENDERER_MAP = {
  [leadSchemaNamePrefix + SCHEMA_NAMES.PROSPECT_STAGE]: NeutralBadge,
  [SCHEMA_NAMES.STATUS]: NeutralBadge
};

export const RESTRICT_ADD_ACTIVITY_EVENT_CODES = {
  [ActivityCodes.INBOUND_PHONE_CALL_ACTIVITY]: true,
  [ActivityCodes.OUTBOUND_PHONE_CALL_ACTIVITY]: true,
  [ActivityCodes.PORTAL_REGISTRATION_CONSTANTS]: true,
  [ActivityCodes.SUBMITTED_FORM_FROM_PORTAL]: true,
  [ActivityCodes.LOGGED_INTO_PORTAL]: true,
  [ActivityCodes.CHANGED_PASSWORD_OF_PORTAL]: true,
  [ActivityCodes.FORGOT_PASSWORD]: true,
  [ActivityCodes.LOGGED_OUT_OF_PORTAL]: true,
  [ActivityCodes.DYNAMIC_FORM_SUBMISSION]: true,
  [ActivityCodes.PAYMENT]: true,
  [ActivityCodes.PUBLISHER_TRACKING]: true,
  [ActivityCodes.FORM_SUBMITTED_ON_PORTAL]: true,
  [ActivityCodes.SAVE_AS_DRAFT]: true,
  [ActivityCodes.FORM_SUBMITTED_ON_WIDGET]: true,
  [ActivityCodes.LANDING_PAGE_PRO_FORM_SUBMISSION]: true,
  [ActivityCodes.SMART_LINK]: true,
  [ActivityCodes.DOCUMENT_GENERATION]: true
};

export const RESTRICT_ROW_ACTIONS_EVENT_CODES = {
  [ActivityCodes.FORM_SUBMITTED_ON_PORTAL]: true,
  [ActivityCodes.PORTAL_REGISTRATION_CONSTANTS]: true,
  [ActivityCodes.SUBMITTED_FORM_FROM_PORTAL]: true,
  [ActivityCodes.LOGGED_INTO_PORTAL]: true,
  [ActivityCodes.CHANGED_PASSWORD_OF_PORTAL]: true,
  [ActivityCodes.FORGOT_PASSWORD]: true,
  [ActivityCodes.LOGGED_OUT_OF_PORTAL]: true,
  [ActivityCodes.PUBLISHER_TRACKING]: true,
  [ActivityCodes.FORM_SUBMITTED_ON_PORTAL]: true,
  [ActivityCodes.FORM_SUBMITTED_ON_PORTAL]: true,
  [ActivityCodes.FORM_SUBMITTED_ON_PORTAL]: true,
  [ActivityCodes.SAVE_AS_DRAFT]: true,
  [ActivityCodes.FORM_SUBMITTED_ON_WIDGET]: true,
  [ActivityCodes.LANDING_PAGE_PRO_FORM_SUBMISSION]: true,
  [ActivityCodes.SMART_LINK]: true,
  [ActivityCodes.INBOUND_PHONE_CALL_ACTIVITY]: true,
  [ActivityCodes.OUTBOUND_PHONE_CALL_ACTIVITY]: true,
  [ActivityCodes.VISIT_ACTIVITY_ON_LANDING_PAGE]: true
};

export const RESTRICT_BULK_UPDATE_EVENT_CODES = {
  [ActivityCodes.SUBMITTED_FORM_FROM_PORTAL]: true,
  [ActivityCodes.LOGGED_INTO_PORTAL]: true,
  [ActivityCodes.CHANGED_PASSWORD_OF_PORTAL]: true,
  [ActivityCodes.FORGOT_PASSWORD]: true,
  [ActivityCodes.LOGGED_OUT_OF_PORTAL]: true,
  [ActivityCodes.FORM_SUBMITTED_ON_PORTAL]: true,
  [ActivityCodes.SMART_LINK]: true,
  [ActivityCodes.PORTAL_REGISTRATION_CONSTANTS]: true,
  [ActivityCodes.OPPORTUNITY_SHARED_THROUGH_AGENT_POPUP]: true
};
