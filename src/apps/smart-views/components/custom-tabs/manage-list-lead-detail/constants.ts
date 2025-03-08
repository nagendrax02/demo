import { ACTION } from 'apps/entity-details/constants';
import { HEADER_ACTION_ID } from '../../smartview-tab/components/header/header-actions/constant';
import { workAreaIds } from 'common/utils/process';
import { HeaderAction, SCHEMA_NAMES } from 'apps/smart-views/constants/constants';
import { handleAddToList, handleDeleteList } from './utils';
import { IFormOnSuccessCallBack } from 'apps/forms/forms.types';
import { Variant } from '@lsq/nextgen-preact/button/button.types';

export const STATIC_FILTERS = [
  'ProspectStage',
  'ProspectActivityDate_Max',
  'CreatedOn',
  'ModifiedOn'
];

export const LIST_TYPES = {
  ['0']: '0', //Static List
  ['1']: '1', //Dynamic List
  ['2']: '2' //Refreshable List
};

export const NON_SORTABLE_COLUMNS = [SCHEMA_NAMES.OWNER_ID_NAME];

export const LIST_STATIC_ACTIONS = [
  {
    id: HEADER_ACTION_ID.QuickAddLead,
    label: 'Quick Add',
    value: HEADER_ACTION_ID.QuickAddLead,
    toolTip: 'Quick Add',
    workAreaConfig: {
      workAreaId: workAreaIds.MORE_ACTION.MANAGE_LEADS.QUICK_ADD
    },
    handleCustomSuccess: (res: IFormOnSuccessCallBack): void => {
      handleAddToList((res?.Response?.LeadDetails as Record<string, string>)?.Id);
    }
  },
  {
    id: HEADER_ACTION_ID.AddNewLead,
    label: 'Add New',
    value: HEADER_ACTION_ID.AddNewLead,
    toolTip: 'Add New',
    workAreaConfig: {
      workAreaId: workAreaIds.MORE_ACTION.MANAGE_LEADS.ADD_NEW
    },
    handleCustomSuccess: (res: IFormOnSuccessCallBack): void => {
      handleAddToList((res?.Response?.LeadDetails as Record<string, string>)?.Id);
    }
  },
  {
    id: ACTION.ListEdit,
    label: `Edit List`,
    value: ACTION.ListEdit,
    toolTip: 'Edit List'
  },
  {
    id: HeaderAction.ExportLeads,
    label: 'Export',
    toolTip: 'Export',
    value: HeaderAction.ExportLeads
  },
  {
    id: ACTION.DeleteAllLead,
    label: 'Delete All',
    toolTip: 'Delete All',
    value: ACTION.DeleteAllLead
  },
  {
    id: ACTION.Delete,
    label: 'Delete List',
    toolTip: 'Delete List',
    value: ACTION.Delete,
    actionHandler: {
      variant: Variant.Error,
      getTitle: (): string => 'Delete List',
      getDescription: (): Promise<string> => {
        return Promise.resolve('Are you sure you want to delete this list?');
      },
      handleDelete: (customConfig: Record<string, string>): Promise<void> =>
        handleDeleteList(customConfig)
    }
  },
  {
    id: ACTION.UpdateAllLead,
    disabled: false,
    label: 'Update All',
    toolTip: 'Update All',
    value: ACTION.UpdateAllLead
  }
];

export const HIDDEN_BULK_ACTIONS = [ACTION.AddToList];

export const HIDE_ALL_LEAD_LIST_ACTIONS = [
  HEADER_ACTION_ID.QuickAddLead,
  HEADER_ACTION_ID.AddNewLead,
  ACTION.ListEdit,
  ACTION.DeleteAllLead,
  ACTION.Delete
];

export const HIDE_DYNAMIC_AND_REFRESHABLE_ACTIONS = [
  ACTION.DeleteAllLead,
  HEADER_ACTION_ID.QuickAddLead,
  HEADER_ACTION_ID.AddNewLead
];

export const LIST_UPDATE_ALL_LEAD = {
  MAX: 40000
};
