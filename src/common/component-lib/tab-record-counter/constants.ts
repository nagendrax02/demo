import { TAB_ID } from '../entity-tabs/constants/tab-id';

export const TASK_COUNTER_SETTING = 'ShowTasksTODOCountInLeadDetails';

export enum RecordType {
  Task = 'Task'
}

export const ValidRecordCounterTabs = [TAB_ID.LeadTasks];

export const TabRecordTypeMap = {
  [TAB_ID.LeadTasks]: RecordType.Task
};
