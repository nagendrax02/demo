import { ACTION } from 'apps/entity-details/constants';

export const HEADER_ACTION_ID = {
  QuickAddLead: 'quick_add_lead',
  AddNewLead: 'add_new_lead',
  QuickAddActivity: 'quick_add_activity',
  AddNewActivity: 'add_new_activity',
  AddAccount: 'add_account',
  AddOpportunity: 'add_opportunity',
  CreateTask: 'create_task',
  AccountAddNewLead: 'account_add_new_lead',
  OpportunityAddNewLead: 'opportunity_add_new_lead',
  AccountAddActivity: 'account_add_new_activity',
  AccountEditActivity: 'AccountEditActivity',
  AccountActivityAddActivity: 'account_activity_add_activity',
  CreateEmptyList: 'create_empty_list',
  CreateNewList: 'create_new_list'
};

export const HEADER_FORM_ACTION = {
  [HEADER_ACTION_ID.QuickAddLead]: ACTION.QuickAddLead,
  [HEADER_ACTION_ID.AddNewLead]: ACTION.AddNewLead,
  [HEADER_ACTION_ID.QuickAddActivity]: ACTION.QuickAddActivity,
  [HEADER_ACTION_ID.CreateTask]: ACTION.CreateTask,
  [HEADER_ACTION_ID.AddAccount]: ACTION.AddAccount,
  [HEADER_ACTION_ID.AccountAddNewLead]: ACTION.AccountAddNewLead,
  [HEADER_ACTION_ID.AddOpportunity]: ACTION.AddOpportunity,
  [HEADER_ACTION_ID.OpportunityAddNewLead]: ACTION.OpportunityAddNewLead,
  [HEADER_ACTION_ID.AccountActivityAddActivity]: ACTION.AccountActivityAddActivity,
  [HEADER_ACTION_ID.AccountEditActivity]: ACTION.AccountEditActivity
};

export const HEADER_BUTTON_ACTION = [
  HEADER_ACTION_ID.QuickAddLead,
  HEADER_ACTION_ID.AddNewLead,
  HEADER_ACTION_ID.QuickAddActivity,
  HEADER_ACTION_ID.CreateTask,
  HEADER_ACTION_ID.AddAccount,
  HEADER_ACTION_ID.AddOpportunity,
  HEADER_ACTION_ID.OpportunityAddNewLead,
  HEADER_ACTION_ID.AccountAddActivity,
  HEADER_ACTION_ID.AccountActivityAddActivity
];

export const NON_PROCESS_BUTTON = [
  HEADER_ACTION_ID.CreateEmptyList,
  HEADER_ACTION_ID.CreateNewList,
  ACTION.SendEmailAction,
  ACTION.ViewScheduledEmail,
  ACTION.ListAddMore
];
