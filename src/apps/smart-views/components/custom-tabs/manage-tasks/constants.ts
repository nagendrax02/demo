import { ACTION } from 'apps/entity-details/constants';
import { IActionConfig } from 'apps/entity-details/types';
import { workAreaIds } from 'common/utils/process';
import { SelectColumn } from 'apps/smart-views/constants/constants';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';

export const DEFAULT_SORT_ON = 'DueDate-asc';

export const DEFAULT_FILTERS = ['TaskType', 'status', 'OwnerId', 'DueDate', 'P_Groups'];

export const DEFAULT_COLUMNS = [
  'UserTaskAutoId',
  'Name',
  'StatusCode',
  'DueDate',
  'Reminder',
  'CreatedBy',
  'OwnerId'
];

export const taskRowActions: IActionConfig[] = [
  {
    key: '201',
    id: ACTION.EditTask,
    title: 'Edit',
    formTitle: 'Edit Task',
    toolTip: 'Edit',
    workAreaConfig: {
      workAreaId: workAreaIds.MANAGE_TASKS.EDIT
    },
    isQuickAction: true
  },
  {
    key: '202',
    id: ACTION.MarkOpen,
    title: 'Mark Open',
    toolTip: 'Mark Open'
  },
  {
    key: '203',
    id: ACTION.MarkComplete,
    title: 'Mark Complete',
    toolTip: 'Mark Complete',
    isQuickAction: true
  },
  {
    key: '204',
    id: ACTION.TaskDelete,
    title: 'Task Delete',
    toolTip: 'Task Delete',
    actionHandler: {},
    isQuickAction: true
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
  }
];

export const MANAGE_TASK_FEATURE_RESTRICTION_MAP: Record<string, string> = {
  [SelectColumn]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageTasks].SelectColumn
};

export const ALL_TASK_TYPES = '-1';
