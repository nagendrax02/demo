import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { TAB_ID } from 'common/component-lib/entity-tabs/constants/tab-id';
import { workAreaIds } from 'common/utils/process';
import { ACTION } from '../entity-details/constants';

export const alertConfig = {
  GENERIC: {
    type: Type.ERROR,
    message: ERROR_MSG.generic
  },
  ACCESS_DENIED: {
    type: Type.WARNING,
    message: 'Access Denied. Please contact administrator'
  },
  DELETE_FAIL: {
    type: Type.ERROR,
    message: 'Task deletion failed'
  },
  DELETE_SUCCESS: {
    type: Type.SUCCESS,
    message: 'Task deleted successfully'
  },
  TASK_STATUS_CHANGE_SUCCESS: {
    type: Type.SUCCESS,
    message: 'Task status changed successfully'
  },
  TASK_COMPLETE_FAIL: {
    type: Type.ERROR,
    message: 'Tasks failed to mark complete'
  },
  TASK_OPEN_FAIL: {
    type: Type.ERROR,
    message: 'Tasks failed to mark open'
  }
};

export const TaskFilterData = [
  {
    value: '-1',
    label: 'All Tasks'
  },
  {
    value: '0',
    label: 'Pending'
  },
  {
    value: '1',
    label: 'Completed'
  },
  {
    value: '3',
    label: 'Overdue'
  }
];

export const DefaultStatusOption = {
  value: '-1',
  label: 'All Tasks'
};

export const DEFAULT_PAGE_SIZE = 25;

export const taskStatus = {
  COMPLETED: 1,
  PENDING: 0
};

export const DEFAULT_DATE = {
  value: 'all_time',
  label: 'All Time',
  startDate: '',
  endDate: ''
};

export const leadTasksProcessAction = {
  ADD_TASK: {
    title: '+ Add Task',
    id: ACTION.DefaultAddTask,
    workAreaConfig: { workAreaId: workAreaIds.LEAD_DETAILS.ADD_TASK }
  },
  EDIT_TASK: {
    name: ACTION.EditTask,
    toolTip: 'Edit',
    workAreaConfig: { workAreaId: workAreaIds.LEAD_DETAILS.EDIT_TASK }
  }
};

export const oppTasksProcessAction = {
  ADD_TASK: {
    title: '+ Add Task',
    id: ACTION.DefaultAddTask,
    workAreaConfig: { workAreaId: workAreaIds.OPPORTUNITY_DETAILS.ADD_TASK }
  },
  EDIT_TASK: {
    name: ACTION.EditTask,
    toolTip: 'Edit',
    workAreaConfig: { workAreaId: workAreaIds.OPPORTUNITY_DETAILS.EDIT_TASK }
  }
};

export const taskActions = {
  [TAB_ID.LeadTasks]: leadTasksProcessAction,
  [TAB_ID.Tasks]: oppTasksProcessAction
};

export const SHOW_FORM = 'ShowForm';

export const EntityType = {
  OPPORTUNITY: '5'
};
