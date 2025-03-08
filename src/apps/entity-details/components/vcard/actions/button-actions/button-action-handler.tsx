import { ACTION } from 'apps/entity-details/constants';
import {
  IActionClickHandler,
  ICallActionClickHandlers,
  IDetermineActionClickHandler
} from './button-actions.types';
import {
  generateAccountAddNewLeadFormConfig,
  generateAccountAttributeDetailsEditFormConfig,
  generateAccountDetailEditVCardFormConfig,
  generateActivityFormConfig,
  generateLeadEditFormConfig,
  generateOpportunityFormConfig,
  generateProcessFormConfig,
  generateQuickLeadDetailEditFormConfig,
  generateTaskFormConfig,
  generateAccountAddNewActivityFormConfig,
  generateAccountAddNewLeadActivityFormConfig,
  generateAccountAddNewTaskFormConfig,
  generateAddNewLeadFormConfig,
  generateQuickAddLeadFormConfig,
  generateAccountEditFormConfig,
  generateQuickAddActivityFormConfig,
  generateOpportunityDetailEditVCardFormConfig,
  generateOpportunityDetailEditFormConfig,
  generateOpportunityAddActivityFormConfig,
  generateOpportunityAddTaskFormConfig,
  generateOpportunityEditTaskFormConfig,
  addActivityForLeadWrapper,
  generateAccountFormConfig,
  generateAddOpportunityConfig,
  generateAccountEditActivityFormConfig,
  generateAccountActivityAddActivityFormConfig
} from './entity-button-action-handler';
import { IFormsConfiguration } from 'apps/forms/forms.types';

function determineActionClickHandler({
  action
}: IDetermineActionClickHandler): IActionClickHandler | null {
  const actionClickHandlerMap = {
    [ACTION.Activity]: generateActivityFormConfig,
    [ACTION.EditActivity]: generateActivityFormConfig,
    [ACTION.SalesActivity]: generateActivityFormConfig,
    [ACTION.Opportunity]: generateOpportunityFormConfig,
    [ACTION.Tasks]: generateTaskFormConfig,
    [ACTION.Processes]: generateProcessFormConfig,
    [ACTION.LeadDetailEditVCard]: generateQuickLeadDetailEditFormConfig,
    [ACTION.Edit]: generateLeadEditFormConfig,
    [ACTION.DefaultAddTask]: generateTaskFormConfig,
    [ACTION.EditTask]: generateTaskFormConfig,
    [ACTION.LeadAttributeDetailsEdit]: generateLeadEditFormConfig,
    [ACTION.AccountAddNewTasks]: generateAccountAddNewTaskFormConfig,
    [ACTION.AccountAddNewActivity]: generateAccountAddNewActivityFormConfig,
    [ACTION.AccountEditActivity]: generateAccountEditActivityFormConfig,
    [ACTION.AccountActivityAddActivity]: generateAccountActivityAddActivityFormConfig,
    [ACTION.AccountAddNewLeadActivity]: generateAccountAddNewLeadActivityFormConfig,
    [ACTION.AccountDetailEditVCard]: generateAccountDetailEditVCardFormConfig,
    [ACTION.AccountAttributeDetailsEdit]: generateAccountAttributeDetailsEditFormConfig,
    [ACTION.AccountAddNewLead]: generateAccountAddNewLeadFormConfig,
    [ACTION.AddAccount]: generateAccountFormConfig,
    [ACTION.AddNewLead]: generateAddNewLeadFormConfig,
    [ACTION.QuickAddLead]: generateQuickAddLeadFormConfig,
    [ACTION.AccountEdit]: generateAccountEditFormConfig,
    [ACTION.QuickAddActivity]: generateQuickAddActivityFormConfig,
    [ACTION.OpportunityDetailEditVCard]: generateOpportunityDetailEditVCardFormConfig,
    [ACTION.OpportunityAttributeDetailsEdit]: generateOpportunityDetailEditFormConfig,
    [ACTION.CreateTask]: generateTaskFormConfig,
    [ACTION.AddTaskForLead]: generateTaskFormConfig,
    [ACTION.AddActivityForLead]: addActivityForLeadWrapper,
    [ACTION.OpportunityAddActivity]: generateOpportunityAddActivityFormConfig,
    [ACTION.OpportunityAddTask]: generateOpportunityAddTaskFormConfig,
    [ACTION.OpportunityEditTask]: generateOpportunityEditTaskFormConfig,
    [ACTION.AddOpportunity]: generateAddOpportunityConfig,
    [ACTION.OpportunityAddNewLead]: generateAddNewLeadFormConfig
  };

  if (actionClickHandlerMap[action.id]) {
    return actionClickHandlerMap[action.id];
  } else {
    return null;
  }
}

async function getFormConfig({
  action,
  entityId,
  onSuccess,
  customConfig,
  onShowFormChange,
  coreData,
  bulkConfig
}: ICallActionClickHandlers): Promise<IFormsConfiguration | null> {
  const actionClickHandler = determineActionClickHandler({ action });

  if (!actionClickHandler) return null;

  const formConfig = await actionClickHandler({
    action,
    entityId,
    customConfig,
    coreData,
    bulkConfig
  });

  if (!formConfig) return null;

  return { ...formConfig, OnSuccess: onSuccess, OnShowFormChange: onShowFormChange };
}

export { getFormConfig };
