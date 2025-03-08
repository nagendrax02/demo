import { DataType, RenderType } from 'common/types/entity/lead';
import { IActionConfig, IQuickActionConfig } from '../../../types';
import { workAreaIds } from 'common/utils/process';
import { ACTION, OPP_CONFIGURATION } from '../../../constants';
import { getOpportunityEventCode } from 'common/utils/helpers';
import { FeatureRestrictionConfigMap } from 'apps/entity-details/types/entity-data.types';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';

const OPP_STAGE_SCHEMA_NAMES = ['OpportunityStatus', 'OpportunityReason', 'OpportunityComment'];
const OPP_INTERNAL_SCHEMA_NAMES = {
  title: 'Title',
  opportunityStatus: 'OpportunityStatus',
  opportunitySourceName: 'OpportunitySourceName',
  opportunitySourceCampaign: 'OpportunitySourceCampaign',
  opportunitySourceMedium: 'OpportunitySourceMedium',
  opportunitySourceTerm: 'OpportunitySourceTerm',
  opportunitySourceContent: 'OpportunitySourceContent'
};

const OPP_RENDER_TYPE_MAP: Record<string, RenderType> = {
  Notes: RenderType.Notes,
  Counter: RenderType.Counter,
  Currency: RenderType.Currency,
  Phone: RenderType.Phone,
  IP: RenderType.IP,
  Select: RenderType.Select,
  Calender: RenderType.Calender,
  Date: RenderType.Date,
  Datetime: RenderType.DateTime,
  Dropdown: RenderType.Dropdown,
  RadioButtons: RenderType.RadioButtons,
  GroupButtons: RenderType.GroupButtons,
  ComboBox: RenderType.ComboBox,
  DropdownWithCheckBox: RenderType.DropdownWithCheckBox,
  Compound: RenderType.Compound,
  DropdownWithOthers: RenderType.DropdownWithOthers,
  CheckboxList: RenderType.CheckboxList,
  HTML: RenderType.HTML,
  Boolean: RenderType.Boolean,
  Number: RenderType.Number,
  DateTime: RenderType.DateTime,
  SearchableDropdown: RenderType.SearchableDropDown,
  LargeOptionSet: RenderType.LargeOptionSet,
  ActiveUsers: RenderType.Text,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ActivityEvent_Note: RenderType.ActivityEvent_Note,
  Product: RenderType.String,
  CustomObject: RenderType.CustomObject,
  String: RenderType.String,
  File: RenderType.File,
  Title: RenderType.Title,
  Form: RenderType.Form,
  Process: RenderType.Process,
  Lead: RenderType.Lead,
  MediaLink: RenderType.MediaLink,
  Text: RenderType.Text,
  Textbox: RenderType.Textbox,
  Email: RenderType.Email,
  SearchableDropDown: RenderType.SearchableDropDown,
  TextArea: RenderType.TextArea,
  Checkbox: RenderType.Checkbox,
  URL: RenderType.URL,
  Time: RenderType.Time,
  MultiSelect: RenderType.MultiSelect,
  UserName: RenderType.UserName,
  SocialMedia: RenderType.SocialMedia,
  Audio: RenderType.Audio,
  DueDate: RenderType.DueDate,
  AccountName: RenderType.AccountName,
  TimeZone: RenderType.TimeZone,
  Component: RenderType.Component,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  String_TextContent_CMS: RenderType.HTML
};

const OPP_DATA_TYPE_MAP: Record<string, DataType> = {
  Text: DataType.Text,
  Email: DataType.Email,
  Phone: DataType.Phone,
  Website: DataType.Website,
  Url: DataType.Url,
  IP: DataType.IP,
  Select: DataType.Select,
  Time: DataType.Time,
  Boolean: DataType.Boolean,
  TimeZone: DataType.TimeZone,
  Country: DataType.Country,
  MultiSelect: DataType.MultiSelect,
  Number: DataType.Number,
  DateTime: DataType.DateTime,
  SearchableDropdown: DataType.SearchableDropdown,
  LargeOptionSet: DataType.LargeOptionSet,
  Dropdown: DataType.Dropdown,
  ActiveUsers: DataType.ActiveUsers,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ActivityEvent_Note: DataType.ActivityEvent_Note,
  Product: DataType.Product,
  CustomObject: DataType.CustomObject,
  String: DataType.String,
  File: DataType.File,
  Title: DataType.Title,
  Form: DataType.Form,
  Process: DataType.Process,
  Lead: DataType.Lead,
  Date: DataType.Date,
  MediaLink: DataType.MediaLink,
  GeoLocation: DataType.GeoLocation,
  Audio: DataType.Audio,
  DueDate: DataType.DueDate
};

export const opportunityFeatureRestrictionConfigMap: FeatureRestrictionConfigMap = {
  OpportunityAttributeDetailsEdit: {
    ...OPP_CONFIGURATION,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.OpportunityDetails]
        .EditOpportunity
  },
  OpportunityDetailEditVCard: {
    ...OPP_CONFIGURATION,
    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.OpportunityDetails]
        .EditOpportunity
  },
  OpportunityDetailPropertiesEdit: {
    ...OPP_CONFIGURATION,

    actionName:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.OpportunityDetails]
        .EditOpportunity
  }
};

const OPP_QUICK_ACTION_CONFIG: Record<string, IQuickActionConfig> = {
  opportunityEdit: {
    name: 'opportunityEdit',
    icon: 'edit',
    onClick: () => {},
    workAreaConfig: {
      workAreaId: workAreaIds.OPPORTUNITY_DETAILS.EDIT_OPPORTUNITY_DETAILS_V_CARD,
      additionalData: `${getOpportunityEventCode()}`
    },
    featureRestrictionConfig: opportunityFeatureRestrictionConfigMap.OpportunityDetailEditVCard,
    id: ACTION.OpportunityDetailEditVCard,
    title: 'Edit VCard'
  }
};

const OPP_PROCESS_ACTION_CONFIG: Record<string, IActionConfig> = {
  Edit: {
    title: 'Edit',
    workAreaConfig: {
      workAreaId: workAreaIds.OPPORTUNITY_DETAILS.EDIT_OPPORTUNITY,
      additionalData: `${getOpportunityEventCode()}`
    },
    id: ACTION.OpportunityAttributeDetailsEdit
  },
  Activity: {
    title: 'Activity',
    workAreaConfig: {
      workAreaId: workAreaIds.OPPORTUNITY_DETAILS.ADD_ACTIVITY,
      additionalData: `${getOpportunityEventCode()}`
    },
    id: ACTION.OpportunityAddActivity
  },
  Tasks: {
    title: 'Tasks',
    workAreaConfig: {
      workAreaId: workAreaIds.OPPORTUNITY_DETAILS.ADD_TASK,
      additionalData: `${getOpportunityEventCode()}`
    },
    id: ACTION.OpportunityAddTask
  }
};

export {
  OPP_STAGE_SCHEMA_NAMES,
  OPP_INTERNAL_SCHEMA_NAMES,
  OPP_RENDER_TYPE_MAP,
  OPP_DATA_TYPE_MAP,
  OPP_QUICK_ACTION_CONFIG,
  OPP_PROCESS_ACTION_CONFIG
};
