import { ReactNode } from 'react';
import styles from './actions.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { CUSTOM_ACTIONS, ACTION } from 'apps/entity-details/constants';
import { ActionRenderType } from 'apps/entity-details/types';
import {
  Edit,
  Delete,
  ChangeOwner,
  ChangeStage,
  OptOut,
  AddSalesActivity,
  CustomAction,
  AddOpportunity,
  AddActivity,
  Call,
  Share,
  AddTask,
  FormIcon,
  EditTask,
  DeleteRecurrence
} from 'assets/custom-icon';
import { workAreaIds } from 'common/utils/process';

import {
  Edit as EditV2,
  Delete as DeleteV2,
  AddActivity as AddActivityV2,
  AddAccountActivity as AddAccountActivityV2,
  ChangeOwner as ChangeOwnerV2,
  ChangeStage as ChangeStageV2,
  AddOpportunity as AddOpportunityV2,
  Form as FormV2,
  Call as CallV2,
  SharedEmail as SharedEmailV2,
  AddTask as AddTaskV2,
  AddNote as AddNoteV2,
  EmailSent as EmailSentV2,
  AddToList as AddToListV2,
  Converse as ConverseV2,
  SaveContact as SaveContactV2,
  Cancel as CancelV2,
  Done as DoneV2,
  Add as AddV2,
  AddLead as AddLeadV2,
  EditTask as EditTaskV2,
  MarkOpen as MarkOpenV2,
  AutomationReport as AutomationReportV2,
  Sales as SalesV2,
  EmailOptOut as EmailOptOutV2,
  DeleteRecurrence as DeleteRecurrenceV2,
  AssignLead as AssignLeadV2
} from 'assets/custom-icon/v2';

export const ICON_MAPPER = {
  [ACTION.Edit]: <Edit className={styles.action_icon} />,
  [ACTION.AccountEdit]: <Edit className={styles.action_icon} />,
  [ACTION.EditActivity]: <Edit className={styles.action_icon} />,
  [ACTION.AccountEditActivity]: <Edit className={styles.action_icon} />,
  [ACTION.Delete]: <Delete className={styles.action_icon} />,
  [ACTION.AccountDelete]: <Delete className={styles.action_icon} />,
  [ACTION.ChangeOwner]: <ChangeOwner className={styles.action_icon} />,
  [ACTION.ChangeStage]: <ChangeStage className={styles.action_icon} />,
  [ACTION.OptOut]: <OptOut className={styles.action_icon} />,
  [ACTION.SalesActivity]: <AddSalesActivity className={styles.action_icon} />,
  [CUSTOM_ACTIONS]: <CustomAction className={styles.action_icon} />,
  [ACTION.Opportunity]: <AddOpportunity className={styles.action_icon} />,
  [ACTION.Activity]: <AddActivity className={styles.action_icon} />,
  [ACTION.AccountAddNewActivity]: <AddActivity className={styles.action_icon} />,
  [ACTION.OpportunityAttributeDetailsEdit]: <Edit className={styles.action_icon} />,
  [ACTION.OpportunityAddActivity]: <AddActivity className={styles.action_icon} />,
  [ACTION.Form]: <FormIcon className={styles.action_icon} />,
  [ACTION.Call]: <Call className={styles.action_icon} />,
  [ACTION.ShareViaEmail]: <Share className={styles.action_icon} />,
  [ACTION.Tasks]: <AddTask className={styles.action_icon} />,
  [ACTION.OpportunityAddTask]: <AddTask className={styles.action_icon} />,
  [ACTION.Note]: <Icon name={'sticky_note_2'} customStyleClass={styles.action_icon} />,
  [ACTION.SendEmail]: <Icon name={'mail'} customStyleClass={styles.action_icon} />,
  [ACTION.SendEmailAction]: <Icon name={'mail'} customStyleClass={styles.action_icon} />,
  [ACTION.AddToList]: <Icon name={'post_add'} customStyleClass={styles.action_icon} />,
  [ACTION.Converse]: <Icon name={'chat'} customStyleClass={styles.action_icon} />,
  [ACTION.SetAsPrimaryContact]: (
    <Icon name={'contact_phone'} customStyleClass={styles.action_icon} />
  ),
  [ACTION.Processes]: <Icon name={'account_tree'} customStyleClass={styles.action_icon} />,
  [ACTION.AutomationReport]: <Icon name={'summarize'} customStyleClass={styles.action_icon} />,
  [ACTION.Cancel]: <Icon name={'cancel'} customStyleClass={styles.action_icon} />,
  [ACTION.EditTask]: <EditTask className={styles.task_action_icon} />,
  [ACTION.MarkOpen]: <Icon name="assignment" customStyleClass={styles.action_icon} />,
  [ACTION.MarkComplete]: <Icon name="task_alt" customStyleClass={styles.action_icon} />,
  [ACTION.TaskDelete]: <Delete className={styles.action_icon} />,
  [ACTION.DeleteRecurrence]: <DeleteRecurrence className={styles.action_icon} />,
  [ACTION.AddActivityForLead]: <AddActivity className={styles.action_icon} />,
  [ACTION.AddTaskForLead]: <AddTask className={styles.action_icon} />,
  [ACTION.TaskCancel]: <Icon name={'cancel'} customStyleClass={styles.action_icon} />,
  [ACTION.Add]: <Icon name={'add'} customStyleClass={styles.action_icon} />,
  [ACTION.AccountAddNewLead]: (
    <Icon name="person_add" customStyleClass={`${styles.action_icon} ${styles.person_add}`} />
  ),
  [ACTION.AccountAssignLead]: <Icon name="group_add" customStyleClass={styles.action_icon} />,
  [ACTION.ListEdit]: <Edit className={styles.action_icon} />,
  [ACTION.ListDelete]: <Delete className={styles.action_icon} />,
  [ACTION.ListAddMore]: <Icon name="add" customStyleClass={styles.action_icon} />
};

export const OPPORTUNITY = 'Opportunity';

export const PROCESS_BUTTON = {
  title: ACTION.Processes,
  id: ACTION.Processes,
  type: ActionRenderType.Button,
  icon: '',
  sequence: 999,
  workAreaConfig: { workAreaId: workAreaIds.LEAD_DETAILS.ADD_ACTIVITY },
  actionHandler: {}
};

export const getV2Icon = (icon: string): ReactNode => {
  const V2_ICON_MAPPER = {
    [ACTION.Edit]: (): ReactNode => <EditV2 className={styles.action_icon_v2} type="outline" />,
    [ACTION.AccountEdit]: (): ReactNode => (
      <EditV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.EditActivity]: (): ReactNode => (
      <EditV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.AccountEditActivity]: (): ReactNode => (
      <EditV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.Delete]: (): ReactNode => <DeleteV2 className={styles.action_icon_v2} type="outline" />,
    [ACTION.AccountDelete]: (): ReactNode => (
      <DeleteV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.ChangeOwner]: (): ReactNode => (
      <ChangeOwnerV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.ChangeStage]: (): ReactNode => (
      <ChangeStageV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.OptOut]: (): ReactNode => (
      <EmailOptOutV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.SalesActivity]: (): ReactNode => (
      <SalesV2 className={styles.action_icon_v2} type="outline" />
    ),
    [CUSTOM_ACTIONS]: (): ReactNode => <FormV2 className={styles.action_icon_v2} type="outline" />,
    [ACTION.Opportunity]: (): ReactNode => (
      <AddOpportunityV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.Activity]: (): ReactNode => (
      <AddActivityV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.AccountAddNewActivity]: (): ReactNode => (
      <AddAccountActivityV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.OpportunityAttributeDetailsEdit]: (): ReactNode => (
      <EditV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.OpportunityAddActivity]: (): ReactNode => (
      <AddActivityV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.Form]: (): ReactNode => <FormV2 className={styles.action_icon_v2} type="outline" />,
    [ACTION.Call]: (): ReactNode => <CallV2 className={styles.action_icon_v2} type="outline" />,
    [ACTION.ShareViaEmail]: (): ReactNode => (
      <SharedEmailV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.Tasks]: (): ReactNode => <AddTaskV2 className={styles.action_icon_v2} type="outline" />,
    [ACTION.OpportunityAddTask]: (): ReactNode => (
      <AddTaskV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.Note]: (): ReactNode => <AddNoteV2 className={styles.action_icon_v2} type="outline" />,
    [ACTION.SendEmail]: (): ReactNode => (
      <EmailSentV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.SendEmailAction]: (): ReactNode => (
      <EmailSentV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.AddToList]: (): ReactNode => (
      <AddToListV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.Converse]: (): ReactNode => (
      <ConverseV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.SetAsPrimaryContact]: (): ReactNode => (
      <SaveContactV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.Processes]: (): ReactNode => (
      <FormV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.AutomationReport]: (): ReactNode => (
      <AutomationReportV2 type="outline" className={styles.action_icon_v2} />
    ),
    [ACTION.Cancel]: (): ReactNode => <CancelV2 className={styles.action_icon_v2} type="outline" />,
    [ACTION.EditTask]: (): ReactNode => (
      <EditTaskV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.MarkOpen]: (): ReactNode => (
      <MarkOpenV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.MarkComplete]: (): ReactNode => (
      <DoneV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.TaskDelete]: (): ReactNode => (
      <DeleteV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.DeleteRecurrence]: (): ReactNode => (
      <DeleteRecurrenceV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.AddActivityForLead]: (): ReactNode => (
      <AddActivityV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.AddTaskForLead]: (): ReactNode => (
      <AddTaskV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.TaskCancel]: (): ReactNode => (
      <CancelV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.Add]: (): ReactNode => <AddV2 className={styles.action_icon_v2} type="outline" />,
    [ACTION.AccountAddNewLead]: (): ReactNode => (
      <AddLeadV2 className={`${styles.action_icon_v2} ${styles.person_add}`} type="outline" />
    ),
    [ACTION.AccountAssignLead]: (): ReactNode => (
      <AssignLeadV2 className={styles.action_icon_v2} type="outline" />
    ),
    [ACTION.ListEdit]: (): ReactNode => <EditV2 className={styles.action_icon_v2} type="outline" />,
    [ACTION.ListDelete]: (): ReactNode => (
      <DeleteV2 className={styles.action_icon_v2} type="outline" />
    )
  };

  return V2_ICON_MAPPER[icon]?.();
};

export const ACTION_WITHOUT_PROCESS = ['ViewScheduledEmail', 'SendEmailAction'];
