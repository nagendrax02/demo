import { DataType, RenderType } from 'common/types/entity/lead';
import { PermissionEntityType } from 'common/utils/permission-manager';
import { SCHEMA_NAMES, TabType } from '../../constants/constants';
import { OPTIONS_OBJ } from 'common/component-lib/date-filter/constants';
import { EntityType } from 'common/types';
import { IColumnConfigMap } from '../../components/smartview-tab/smartview-tab.types';
import { IAvailableField } from './common.types';
import { IPinActionConfig } from 'common/component-lib/sortable-list/sortable-list.types';

export const CHECKBOX_COLUMN = 'CheckBoxColumn';

export const nonLeadTabTypeManageFilterConfig = {
  disallowedLeadFilter: {
    ['ProspectActivityDate_Min']: 1,
    ['FirstLandingPageSubmissionDate']: 1,
    ['ProspectActivityName_Max']: 1,
    ['ProspectActivityDate_Max']: 1,
    ['LastOptInEmailSentDate']: 1,
    ['NotableEventdate']: 1,
    ['LastVisitDate']: 1,
    ['OptInDate']: 1,
    ['LeadConversionDate']: 1,
    ['LeadLastModifiedOn']: 1
  },

  canIncludeAsLeadFilter: {
    ['OwnerId']: 1,
    ['Groups']: 1
  },
  allowedLeadDataType: { [DataType.Select]: 1, [DataType.Date]: 1, [DataType.MultiSelect]: 1 }
};

export const PERMISSION_ENTITY_TYPE: Record<string, PermissionEntityType> = {
  [TabType.Lead]: PermissionEntityType.Lead,
  [TabType.Activity]: PermissionEntityType.Activity,
  [TabType.Account]: PermissionEntityType.Accounts,
  [TabType.Opportunity]: PermissionEntityType.Opportunity,
  [EntityType.Lead]: PermissionEntityType.Lead,
  [EntityType.Activity]: PermissionEntityType.Activity,
  [EntityType.Account]: PermissionEntityType.Accounts
};

export const PLATFORM_FILTER_SELECT_ALL_VALUE = ['any', 'all', 'any product', 'any - product']; // keep all in lowercase

export const PLATFORM_FILTER_VALUE = {
  CURRENT_USER: '__mx_current_user__'
};

export const defaultWidthMap: Record<string, number> = {
  [RenderType.DateTime]: 162,
  [RenderType.Datetime]: 162
};

export const defaultMinWidthMap: Record<string, number> = {
  [SCHEMA_NAMES.STATUS_CODE]: 130
};

export const PLATFORM_DATE_OPTION = {
  CUSTOM: 'opt-custom'
};

export const PlatformDateOptionMap: Record<string, { label: string; value: string }> = {
  ['opt-all-time']: OPTIONS_OBJ.ALL_TIME,
  [PLATFORM_DATE_OPTION.CUSTOM]: OPTIONS_OBJ.CUSTOM,
  ['opt-yesterday']: OPTIONS_OBJ.YESTERDAY,
  ['opt-today']: OPTIONS_OBJ.TODAY,
  ['opt-last-week']: OPTIONS_OBJ.LAST_WEEK,
  ['opt-this-week']: OPTIONS_OBJ.THIS_WEEK,
  ['opt-last-month']: OPTIONS_OBJ.LAST_MONTH,
  ['opt-this-month']: OPTIONS_OBJ.THIS_MONTH,
  ['opt-last-year']: OPTIONS_OBJ.LAST_YEAR,
  ['opt-this-year']: OPTIONS_OBJ.THIS_YEAR,
  ['opt-last-seven-days']: OPTIONS_OBJ.LAST_7_DAYS,
  ['opt-last-thirty-days']: OPTIONS_OBJ.LAST_30_DAYS
};

export const PERMISSION_SCHEMA_NAME_MAP: Record<string, string> = {
  ['P_OwnerIdName']: 'OwnerId',
  ['OwnerIdName']: 'OwnerId'
};

export const MANAGE_ENTITY_LEAD_TYPE = 'leadType';

export const DEFAULT_PINNED_COLUMN_CONFIG: IPinActionConfig = {
  showPinAction: true,
  isPinned: true,
  canUnpin: false
};

export const DEFAULT_COLUMN_CONFIG_MAP: Record<string, IColumnConfigMap> = {
  Account: {
    AccountIdentifier: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    },
    Actions: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    }
  },
  AccountActivity: {
    ['C_CompanyName']: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    },
    Actions: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    }
  },
  Activity: {
    LeadIdentifier: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    },
    Actions: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    }
  },
  Lead: {
    LeadIdentifier: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    },
    Actions: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    }
  },
  Opportunity: {
    ['mx_Custom_1']: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    },
    Actions: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    }
  },
  Task: {
    Name: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    },
    Actions: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    }
  },
  ManageTask: {
    Name: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    },
    RelatedEntityId: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    },
    StatusCode: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    },
    Actions: {
      pinnedColumnConfig: DEFAULT_PINNED_COLUMN_CONFIG
    }
  }
};

export const ACTION_COLUMN_SCHEMA_NAME = 'Actions';

export const ACTION_COLUMN_CONFIG: IAvailableField = {
  schemaName: ACTION_COLUMN_SCHEMA_NAME,
  displayName: 'Actions',
  renderType: RenderType.Component,
  isSortable: false,
  id: 'Actions',
  label: 'Actions',
  isRemovable: true,
  isDisabled: true,
  isSelected: true,
  isDraggable: true
};

export const ASSOCIATED_TO = 'Associated To';
