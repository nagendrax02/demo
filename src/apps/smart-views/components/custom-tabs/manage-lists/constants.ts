import {
  IActionConfig,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import ListIdentifier from '../../cell-renderers/ListIdentifier';
import RowActions from '../../cell-renderers/row-actions/RowActions';
import { IColumn } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { DataType, RenderType } from 'common/types/entity/lead';
import ListMemberCount from './ListMemberCount';
import ListTypeRenderer from './ListTypeRenderer';
import ListTypeTooltip from './ListTypeTooltip';
import styles from './manage-list.module.css';
import { ACTION } from 'apps/entity-details/constants';
import { HEADER_ACTION_ID } from '../../smartview-tab/components/header/header-actions/constant';
import { IMenuItem } from '@lsq/nextgen-preact/action-menu/action-menu.types';
import cellRendererStyle from 'apps/smart-views/components/cell-renderers/cell-renderer.module.css';
import { ShowListType } from './manage-lists.types';

export const DEFAULT_COLUMNS = [
  'Name',
  'MemberCount',
  'ListType',
  'ModifiedOn',
  'ModifiedByName',
  'CreatedOn',
  'CreatedByName'
];

export const DEFAULT_FILTERS = ['ListType', 'CreatedBy'];

export const DEFAULT_SORT_ON = 'CreatedOn-desc';

export const customColumnDefs: Record<string, IColumn> = {
  Name: {
    id: 'Name',
    displayName: 'List Name',
    sortable: true,
    resizable: true,
    sortKey: 'Name',
    width: 150,
    minWidth: 150,
    CellRenderer: ListIdentifier
  },
  Actions: {
    width: 160,
    fixed: true,
    minWidth: 160,
    id: 'Actions',
    sortable: false,
    resizable: false,
    displayName: 'Actions',
    isLastFixedColumn: true,
    CellRenderer: RowActions,
    customHeaderCellStyle: cellRendererStyle.action_header_style
  }
};

export const DEFAULT_LISTS_REPRESENTATION_NAME: IEntityRepresentationName = {
  SingularName: 'List',
  PluralName: 'Lists'
};

export const ColumnConfig = {
  Name: {
    displayName: 'List Name',
    sortKey: 'Name',
    id: 'Name'
  },
  MemberCount: {
    displayName: 'Member Count',
    sortKey: 'MemberCount',
    id: 'MemberCount'
  },
  ListType: {
    displayName: 'List Type',
    sortKey: 'ListType',
    id: 'ListType'
  },
  ModifiedOn: {
    displayName: 'Modified On',
    sortKey: 'ModifiedOn',
    id: 'ModifiedOn'
  },
  ModifiedByName: {
    displayName: 'Modified By',
    sortKey: 'ModifiedByName',
    id: 'ModifiedByName'
  },
  CreatedOn: {
    displayName: 'Created On',
    sortKey: 'CreatedOn',
    id: 'CreatedOn'
  },
  CreatedByName: {
    displayName: 'Created By',
    sortKey: 'CreatedByName',
    id: 'CreatedByName'
  }
};

export const DEFAULT_LIST_COLUMNS: IColumn[] = [
  {
    id: ColumnConfig.Name.id,
    displayName: ColumnConfig.Name.displayName,
    sortKey: ColumnConfig.Name.sortKey,
    fixed: true,
    isFirstColumn: true,
    isLastFixedColumn: false,
    resizable: true,
    minWidth: 150,
    width: 150,
    sortable: true,
    CellRenderer: ListIdentifier
  },
  {
    id: ColumnConfig.MemberCount.id,
    displayName: ColumnConfig.MemberCount.displayName,
    sortKey: ColumnConfig.MemberCount.sortKey,
    sortable: true,
    fixed: true,
    resizable: true,
    width: 150,
    minWidth: 96,
    isFirstColumn: false,
    isLastFixedColumn: false,
    CellRenderer: ListMemberCount
  },
  {
    id: ColumnConfig.ListType.id,
    displayName: ColumnConfig.ListType.displayName,
    sortKey: ColumnConfig.ListType.sortKey,
    sortable: false,
    fixed: true,
    resizable: true,
    width: 150,
    minWidth: 96,
    renderType: RenderType.Text,
    isFirstColumn: false,
    isLastFixedColumn: false,
    dataType: DataType.Text,
    CellRenderer: ListTypeRenderer,
    headerIconRenderer: ListTypeTooltip,
    customHeaderCellStyle: styles.header_cell
  },
  {
    width: 156,
    fixed: true,
    minWidth: 156,
    id: 'Actions',
    sortable: false,
    resizable: false,
    displayName: 'Actions',
    isLastFixedColumn: true,
    CellRenderer: RowActions,
    customHeaderCellStyle: cellRendererStyle.action_header_style
  },
  {
    id: ColumnConfig.ModifiedByName.id,
    displayName: ColumnConfig.ModifiedByName.displayName,
    sortKey: ColumnConfig.ModifiedByName.sortKey,
    sortable: false,
    fixed: false,
    resizable: true,
    width: 200,
    minWidth: 96,
    isFirstColumn: false,
    isLastFixedColumn: false,
    dataType: DataType.Text,
    renderType: RenderType.Text
  },
  {
    id: ColumnConfig.ModifiedOn.id,
    displayName: ColumnConfig.ModifiedOn.displayName,
    sortKey: ColumnConfig.ModifiedOn.sortKey,
    sortable: true,
    fixed: false,
    resizable: true,
    width: 200,
    minWidth: 96,
    dataType: DataType.Text,
    isFirstColumn: false,
    isLastFixedColumn: false,
    renderType: RenderType.DateTime
  },
  {
    id: ColumnConfig.CreatedByName.id,
    displayName: ColumnConfig.CreatedByName.displayName,
    sortKey: ColumnConfig.CreatedByName.sortKey,
    sortable: false,
    fixed: false,
    resizable: true,
    width: 200,
    minWidth: 96,
    dataType: DataType.Date,
    isFirstColumn: false,
    isLastFixedColumn: false,
    renderType: RenderType.Text
  },
  {
    id: ColumnConfig.CreatedOn.id,
    displayName: ColumnConfig.CreatedOn.displayName,
    sortKey: ColumnConfig.CreatedOn.sortKey,
    sortable: true,
    fixed: false,
    resizable: true,
    width: 200,
    minWidth: 96,
    dataType: DataType.Date,
    isFirstColumn: false,
    isLastFixedColumn: false,
    renderType: RenderType.DateTime
  }
];

export const actionKeys = {
  sendEmail: 'sendEmail',
  edit: 'edit',
  delete: 'delete',
  hide: 'hide',
  unhide: 'unhide',
  sendSms: 'Send SMS'
};

export const DEFAULT_QUICK_ACTIONS = [actionKeys.sendEmail, actionKeys.edit, actionKeys.delete];

export const STATIC_QUICK_ACTIONS = [actionKeys.sendEmail, actionKeys.sendSms];

export const staticRowAction: IActionConfig[] = [
  {
    key: actionKeys.sendEmail,
    id: ACTION.SendEmailAction,
    title: 'Send Email',
    toolTip: 'Send Email',
    disabled: false
  },
  {
    key: actionKeys.edit,
    id: ACTION.ListEdit,
    title: 'Edit',
    toolTip: 'Edit',
    disabled: false,
    hideForInternalList: true
  },
  {
    key: actionKeys.delete,
    id: ACTION.ListDelete,
    title: 'Delete',
    toolTip: 'Delete',
    disabled: false,
    hideForInternalList: true
  },
  {
    key: actionKeys.hide,
    id: ACTION.ListHide,
    title: 'Hide',
    toolTip: 'Hide',
    disabled: false,
    hideForInternalList: true
  },
  {
    key: actionKeys.unhide,
    id: ACTION.ListUnhide,
    title: 'Unhide',
    toolTip: 'Unhide',
    disabled: false,
    hideForInternalList: true
  }
];

export const bulkActions: IMenuItem[] = [
  {
    label: 'Hide',
    value: '1',
    id: ACTION.BulkListHide
  },
  {
    label: 'Unhide',
    value: '2',
    id: ACTION.BulkListUnhide
  },
  {
    label: 'Delete',
    value: '3',
    id: ACTION.ListBulkDelete
  }
];

export const LIST_SEND_EMAIL_LIMIT = {
  MAX: 20000,
  MIN: 1
};

export const INTERNAL_LIST = {
  STARRED_LEADS: 'Starred Leads',
  ALL_LEADS: 'AllLeadsList'
};

export const INTERNAL_LIST_NAME = [INTERNAL_LIST.STARRED_LEADS, INTERNAL_LIST.ALL_LEADS];

export const HEADER_ACTION_REP_NAME = {
  [HEADER_ACTION_ID.CreateNewList]: 'Add List',
  [HEADER_ACTION_ID.CreateEmptyList]: 'Add Empty List'
};

export const HIDDEN_LIST = {
  [ShowListType.SHOW]: {
    label: 'Hide Hidden Lists',
    value: ShowListType.SHOW
  },
  [ShowListType.HIDE]: {
    label: 'Show Hidden Lists',
    value: ShowListType.HIDE
  }
};
