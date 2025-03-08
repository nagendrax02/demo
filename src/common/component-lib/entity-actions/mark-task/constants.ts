import { TaskActionType } from './mark-task.type';

export const TASK_ERR_MESSAGES = {
  MARK_OPEN_EXCEPTION:
    "You don't have sufficient permission to mark this task as Open. It's linked to a closed {{oppSingularRepName}}. Please consult your administrator for assistance.",
  MARK_TASK_SUCCESS: 'Task{{MESSAGE_POSTFIX}} status changed successfully',
  MARK_OPEN_FAILURE: 'Tasks failed to mark open.',
  MARK_COMPLETE_FAILURE: 'Tasks failed to mark complete.'
};

export const MARK_FAILURE = {
  [TaskActionType.COMPLETE]: TASK_ERR_MESSAGES.MARK_COMPLETE_FAILURE,
  [TaskActionType.OPEN]: TASK_ERR_MESSAGES.MARK_OPEN_FAILURE
};

export const MXOpportunityRestrictedException = 'MXOpportunityRestrictedException';
