/* eslint-disable @typescript-eslint/naming-convention */
import { IColumn } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { AccountIdentifier } from 'apps/smart-views/components/cell-renderers/AccountIdentifier';
import RowActions from 'src/apps/smart-views/components/cell-renderers/row-actions/RowActions';
import cellRendererStyle from 'apps/smart-views/components/cell-renderers/cell-renderer.module.css';
import { ACTION } from 'apps/entity-details/constants';
import { IActionConfig } from 'apps/entity-details/types';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { DataType } from 'common/types/entity/lead';
import AssociatedEntity from 'apps/smart-views/components/cell-renderers/associated-entity';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { ManageFilters, SCHEMA_NAMES, SelectColumn } from '../../constants/constants';
import NeutralBadge from '../../components/cell-renderers/NeutralBadge';

export const customColumnDefs: Record<string, IColumn> = {
  AccountIdentifier: {
    id: 'AccountIdentifier',
    displayName: 'Account Name',
    sortable: true,
    resizable: true,
    sortKey: 'CompanyName',
    width: 220,
    minWidth: 220,
    CellRenderer: AccountIdentifier
  },
  PrimaryContact: {
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

export const cellRendererBasedOnSchema: Record<string, (props: unknown) => JSX.Element> = {
  CompanyName: AccountIdentifier,
  [SCHEMA_NAMES.STAGE]: NeutralBadge
};

export const NOT_ALLOWED_COLUMNS = {
  CheckBoxColumn: true
};

export const defaultQuickActions = ['301', '302', '304'];

export const actionKeys = {
  edit: '301',
  addLead: '302',
  assignLead: '303',
  addActivity: '304',
  changeOwner: '305',
  changeStage: '306',
  delete: '307'
};

export const accountRowActions: IActionConfig[] = [
  {
    key: actionKeys.edit,
    id: ACTION.AccountEdit,
    title: 'Edit',
    toolTip: 'Edit',
    actionHandler: {}
  },
  {
    key: actionKeys.addLead,
    id: ACTION.AccountAddNewLead,
    title: 'Add Lead',
    toolTip: 'Add Lead',
    actionHandler: {}
  },
  {
    key: actionKeys.assignLead,
    id: ACTION.AccountAssignLead,
    title: 'Assign Leads',
    toolTip: 'Assign Leads',
    actionHandler: {}
  },
  {
    key: actionKeys.addActivity,
    id: ACTION.AccountAddNewActivity,
    title: 'Add Activity',
    toolTip: 'Add Activity',
    actionHandler: {}
  },
  {
    key: actionKeys.changeOwner,
    id: ACTION.ChangeOwner,
    title: 'Change Owner',
    toolTip: 'Change Owner',
    actionHandler: {}
  },
  {
    key: actionKeys.changeStage,
    id: ACTION.ChangeStage,
    title: 'Change Stage',
    toolTip: 'Change Stage',
    actionHandler: {}
  },
  {
    key: actionKeys.delete,
    id: ACTION.AccountDelete,
    title: 'Delete',
    toolTip: 'Delete',
    disabled: false,
    actionHandler: {
      getTitle: () => 'Delete Account',
      getDescription: () => 'Are you sure you want to delete selected Account?'
    }
  }
];

export const BulkActionKeys = {
  ChangeOwner: '17',
  ChangeStage: '18',
  Delete: '19'
};

export const accountBulkActions: IMenuItem[] = [
  {
    label: 'Change Owner',
    value: BulkActionKeys.ChangeOwner,
    id: ACTION.ChangeOwner
  },
  {
    label: 'Change Stage',
    value: BulkActionKeys.ChangeStage,
    id: ACTION.ChangeStage
  },
  {
    label: 'Delete',
    value: BulkActionKeys.Delete,
    id: ACTION.AccountDelete
  }
];

export const ACCOUNT_DEFAULT_FILTERS = ['Stage', 'OwnerId'];

export const leadSchemaNamePrefix = 'P_';

export const OWNER_DROPDOWN_SCHEMA = {
  OwnerId: 'OwnerId',
  [`${leadSchemaNamePrefix}OwnerId`]: `${leadSchemaNamePrefix}OwnerId`,
  Owner: 'Owner',
  PACreatedByName: 'PACreatedByName'
};

export const replaceableSchema: Record<string, string> = {
  PACreatedByName: 'CreatedBy'
};

export const AccountManageFilterConfig = {
  allowedDataType: {
    [DataType.Dropdown]: 1,
    [DataType.SearchableDropdown]: 1,
    [DataType.Date]: 1,
    [DataType.DateTime]: 1,
    [DataType.ActiveUsers]: 1,
    [DataType.LargeOptionSet]: 1,
    [DataType.Product]: 1,
    [DataType.Lead]: 1
  }
};

export const PlatformSettingsSchemaMap: Record<string, string> = {
  Stage: 'Stage',
  OwnerId: 'AccountOwner'
};

export const accountDateTypeFilterMap = {
  '0': 'ProspectActivityDate_Max',
  '1': 'CreatedOn',
  '2': 'ModifiedOn',
  '3': 'LastActivityOn'
};

export const OnResetFilters = ['Stage', 'OwnerId', 'CreatedOn'];
export const OnResetColumns = ['AccountIdentifier', 'Stage', 'OwnerName', 'Phone', 'ModifiedOn'];

export const DefaultAccountRepName = { SingularName: 'Account', PluralName: 'Accounts' };

const AccountAddNewLead = 'account_add_new_lead';

export const ACCOUNT_HEADER_MENU_FEATURE_RESTRICTION_MAP: Record<string, string> = {
  [AccountAddNewLead]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].AddNewLead,
  [ManageFilters]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].ManageFilters,
  [SelectColumn]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].SelectColumn
};
