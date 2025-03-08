import { ActionRenderType } from 'apps/entity-details/types';
import { ACTION } from 'apps/entity-details/constants';
import { handleDeleteList } from './helpers';
import { workAreaIds } from 'common/utils/process';

export const LIST_STATIC_ACTIONS = [
  {
    key: '1',
    id: ACTION.QuickAddLead,
    title: 'Quick Add',
    toolTip: 'Quick Add',
    actionHandler: {},
    type: ActionRenderType.Dropdown,
    workAreaConfig: {
      workAreaId: workAreaIds.MORE_ACTION.MANAGE_LEADS.QUICK_ADD
    }
  },
  {
    key: '2',
    id: ACTION.AddNewLead,
    title: 'Add New',
    toolTip: 'Add New',
    actionHandler: {},
    type: ActionRenderType.Dropdown,
    workAreaConfig: {
      workAreaId: workAreaIds.MORE_ACTION.MANAGE_LEADS.ADD_NEW
    }
  },
  {
    key: '3',
    id: ACTION.ListEdit,
    title: 'Edit List',
    toolTip: 'Edit List',
    actionHandler: {},
    type: ActionRenderType.Dropdown
  },
  {
    key: '4',
    id: ACTION.ExportLead,
    title: 'Export',
    toolTip: 'Export',
    actionHandler: {},
    type: ActionRenderType.Dropdown
  },
  {
    key: '5',
    id: ACTION.DeleteAllLead,
    title: 'Delete All',
    toolTip: 'Delete All',
    actionHandler: {},
    type: ActionRenderType.Dropdown
  },
  {
    key: '6',
    id: ACTION.Delete,
    title: 'Delete List',
    toolTip: 'Delete List',
    actionHandler: {
      getTitle: (): string => 'Delete List',
      getDescription: (): Promise<string> => {
        return Promise.resolve('Are you sure you want to delete this list?');
      },
      handleDelete: (): Promise<void> => handleDeleteList()
    },
    type: ActionRenderType.Dropdown
  },
  {
    key: '7',
    id: ACTION.UpdateAllLead,
    disabled: false,
    title: 'Update All',
    toolTip: 'Update All',
    actionHandler: {},
    type: ActionRenderType.Dropdown
  },
  {
    key: '8',
    id: ACTION.ListAddMore,
    disabled: false,
    title: 'Add',
    toolTip: 'Add',
    actionHandler: {},
    type: ActionRenderType.Button
  },
  {
    key: '9',
    id: ACTION.SendEmailAction,
    disabled: false,
    title: 'Send Email',
    toolTip: 'Send Email',
    actionHandler: {},
    type: ActionRenderType.Button
  }
];

export const HIDE_ALL_LEAD_LIST_ACTIONS = [
  ACTION.QuickAddLead,
  ACTION.AddNewLead,
  ACTION.ListEdit,
  ACTION.DeleteAllLead,
  ACTION.Delete
];

export const HIDE_DYNAMIC_AND_REFRESHABLE_ACTIONS = [
  ACTION.QuickAddLead,
  ACTION.AddNewLead,
  ACTION.DeleteAllLead
];

export const LIST_UPDATE_ALL_LEAD = {
  MAX: 40000
};
