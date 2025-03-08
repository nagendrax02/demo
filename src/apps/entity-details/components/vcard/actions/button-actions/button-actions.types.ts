import { IFormOnSuccessCallBack, IFormsConfiguration } from 'apps/forms/forms.types';
import { IWorkAreaConfig } from 'common/utils/process/process.types';
import { IEntityDetailsCoreData } from '../../../../types/entity-data.types';
import { IBulkSubmissionConfig } from 'apps/forms/bulk-submission.types';

export interface IActionBtnForProcess {
  id: string;
  title: string;
  toolTip?: string;
  workAreaConfig?: IWorkAreaConfig;
  value?: string;
  entityId?: string;
  entityTypeId?: string;
  formTitle?: string;
}
export interface IGenericActionBtnClickConfig {
  action: IActionBtnForProcess;
  entityId?: string;
  customConfig?: Record<string, string>;
  coreData?: IEntityDetailsCoreData;
  bulkConfig?: IBulkSubmissionConfig;
}

export type IActionClickHandler = (
  genericActionBtnClickConfig: IGenericActionBtnClickConfig
) => Promise<IFormsConfiguration | null>;
export type IGenerateActivityFormConfig = IGenericActionBtnClickConfig;
export type IGenerateOpportunityFormConfig = IGenericActionBtnClickConfig;
export type IGenerateTaskFormConfig = IGenericActionBtnClickConfig;
export type IDetermineActionClickHandler = IGenericActionBtnClickConfig;
export type IGenerateProcessFormConfig = IGenericActionBtnClickConfig;
export type IGenerateQuickLeadDetailEditFormConfig = IGenericActionBtnClickConfig;
export type IGenerateLeadEdotFormConfig = IGenericActionBtnClickConfig;
export interface IHandleProcessFormConfigGenerationForAction extends IGenericActionBtnClickConfig {
  defaultFormConfigGenerator?: () => IFormsConfiguration | null;
}
export interface ICallActionClickHandlers extends IGenericActionBtnClickConfig {
  onSuccess?: (saveFormCallBackConfig: IFormOnSuccessCallBack) => void;
  onShowFormChange?: (showForm: boolean) => void;
  coreData?: IEntityDetailsCoreData;
  bulkConfig?: IBulkSubmissionConfig;
}
