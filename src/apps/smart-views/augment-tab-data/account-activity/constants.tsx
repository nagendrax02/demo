import { IColumn } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import AssociatedEntity from 'apps/smart-views/components/cell-renderers/associated-entity';
import cellRendererStyle from 'apps/smart-views/components/cell-renderers/cell-renderer.module.css';
import RowActions from 'src/apps/smart-views/components/cell-renderers/row-actions/RowActions';
import { ACTION } from 'apps/entity-details/constants';
import { IActionConfig } from 'apps/entity-details/types';
import { DataType } from 'common/types/entity/lead';
import { handleDeleteActivity } from './helpers';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import {
  ACCOUNT_SCHEMA_PREFIX,
  ManageFilters,
  SCHEMA_NAMES,
  SelectColumn
} from '../../constants/constants';
import { AccountIdentifier } from 'apps/smart-views/components/cell-renderers/AccountIdentifier';
import NeutralBadge from '../../components/cell-renderers/NeutralBadge';
import { ASSOCIATED_TO } from '../common-utilities/constant';

export const customColumnDefs: Record<string, IColumn> = {
  [`${ACCOUNT_SCHEMA_PREFIX}CompanyName`]: {
    id: 'AccountIdentifier',
    displayName: ASSOCIATED_TO,
    sortable: true,
    resizable: true,
    sortKey: `${ACCOUNT_SCHEMA_PREFIX}CompanyName`,
    width: 220,
    minWidth: 220,
    CellRenderer: AccountIdentifier
  },
  [`${ACCOUNT_SCHEMA_PREFIX}PrimaryContact`]: {
    id: 'PrimaryContact',
    displayName: 'Primary Contact',
    sortable: false,
    resizable: true,
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

export const actionKeys = {
  edit: '401',
  delete: '402'
};

export const defaultQuickActions = [actionKeys.edit, actionKeys.delete];

export const leadInfoColumns =
  'P_ProspectStage,P_mx_City,P_PhotoUrl,P_mx_State,P_mx_Country,P_DoNotEmail,P_DoNotCall';

export const activityRowActions: IActionConfig[] = [
  {
    key: actionKeys.edit,
    id: ACTION.AccountEditActivity,
    title: 'Edit',
    toolTip: 'Edit',
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
      getDescription: () => 'Are you sure you want to delete selected Activity?',
      handleDelete: async (customConfig?: Record<string, string>): Promise<void> => {
        await handleDeleteActivity(customConfig);
      }
    }
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

export const ActivityStatus = 'Status';
export const ACTIVITY_DEFAULT_FILTERS = ['Owner', 'Status', 'ActivityDate', 'ModifiedOn'];

export const leadSchemaNamePrefix = 'P_';

export const OWNER_DROPDOWN_SCHEMA = {
  OwnerId: 'OwnerId',
  [`${leadSchemaNamePrefix}OwnerId`]: `${leadSchemaNamePrefix}OwnerId`,
  Owner: 'Owner',
  PACreatedByName: 'PACreatedByName'
};

export const nonSortableFields = {
  ['ActivityEvent_Note']: true
};

export const ActivityManageFilterConfig = {
  allowedDataType: {
    [DataType.Dropdown]: 1,
    [DataType.SearchableDropdown]: 1,
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

export const platformSettingsSchemaMap: Record<string, string> = {
  //TODO: need to remove this constant
  ActivityDate: 'ActivityDate'
};

export const ACTIVITY_HEADER_MENU_FEATURE_RESTRICTION_MAP: Record<string, string> = {
  [ManageFilters]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].ManageFilters,
  [SelectColumn]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].SelectColumn
};

export const COLUMN_RENDERER_MAP = {
  [ACCOUNT_SCHEMA_PREFIX + SCHEMA_NAMES.STAGE]: NeutralBadge,
  [SCHEMA_NAMES.STATUS]: NeutralBadge
};
