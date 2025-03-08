import { trackError } from 'common/utils/experience/utils/track-error';
import {
  IProcessActionOutput,
  IProcessFormsData,
  IProcessResponse,
  IWorkAreaConfig
} from 'common/utils/process/process.types';
import { IProcessActionExecutorResponse } from './process-forms.types';
import { getEntityId } from 'common/utils/helpers';
import { IFormOnSuccessCallBack, IFormsConfiguration } from './forms.types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { workAreaIds, getProcessKey } from 'common/utils/process';
import { isDefaultForm } from './utils';
import { IEntityDetailsCoreData } from '../entity-details/types/entity-data.types';
import { MarvinQuickAddWorkAreaIds } from './common.types';

interface IGetProcessDetailsBasedOnProcessId {
  workAreaId: number;
  processId: string;
  additionalData?: string;
  onSuccess?: (saveFormCallBackConfig: IFormOnSuccessCallBack) => void;
  onShowFormChange?: (showForm: boolean) => void;
  entityData?: Record<string, string>;
  customConfig?: Record<string, string>;
  coreData?: IEntityDetailsCoreData;
  formId?: string;
}

interface IFindProcessActionOutput {
  workAreaProcessDetails: IProcessResponse;
  processId?: string;
  formId?: string;
}

const isMatchingActionOutput = (
  actionOutput: IProcessActionOutput,
  processId: string,
  formId?: string
): boolean => {
  return (
    actionOutput?.ProcessId?.replaceAll('-', '') === processId?.replaceAll('-', '') &&
    actionOutput?.Entity?.FormId?.replaceAll('-', '') === formId?.replaceAll('-', '')
  );
};

const findProcessActionOutput = ({
  workAreaProcessDetails,
  processId,
  formId
}: IFindProcessActionOutput): null | IProcessActionOutput => {
  if (!workAreaProcessDetails || !workAreaProcessDetails?.ActionOutputs?.length) return null;
  for (const actionOutput of workAreaProcessDetails.ActionOutputs) {
    if (!processId) {
      return actionOutput;
    }

    // replace is done since in SV we get process and form ids without "-"
    if (isMatchingActionOutput(actionOutput, processId, formId)) {
      return actionOutput;
    }
  }
  return null;
};

interface IGenerateFormsDataFromProcessData {
  processData: IProcessActionOutput | null;
  onSuccess?: (saveFormCallBackConfig: IFormOnSuccessCallBack) => void;
  customConfig?: Record<string, unknown>;
  onShowFormChange?: (showForm: boolean) => void;
  entityData?: Record<string, string>;
  coreData?: IEntityDetailsCoreData;
  workAreaId?: number;
}

interface IGenerateFormsDataRelatedToProcessData {
  processData: IProcessActionOutput;
}

const generateFormsDataRelatedToProcessData = ({
  processData
}: IGenerateFormsDataRelatedToProcessData): IProcessActionExecutorResponse => {
  const { ActionId, ProcessAutoId, Entity, IsFurtherActionExists } = processData;
  const { ActionButtonProperty, DisplayProperty, SuccessMessageProperty } = Entity;
  const processActionData: IProcessActionExecutorResponse = {
    ActionId,
    ActionButtonProperty,
    DisplayProperty,
    ProcessAutoId,
    PreSubmissionEvent: {
      PreSubmission: Entity.Events?.PreSubmission
    },
    SuccessMessageProperty,
    HasFurtherAction: IsFurtherActionExists
  };

  return processActionData;
};

const getLeadId = (
  coreData?: IEntityDetailsCoreData,
  customConfig?: Record<string, unknown>
): string => {
  return coreData?.entityIds?.lead || (customConfig?.ProspectID as string) || getEntityId();
};

const getOppId = (coreData?: IEntityDetailsCoreData): string => {
  return coreData?.entityIds?.opportunity || '';
};

const getEntityType = (coreData?: IEntityDetailsCoreData): string => {
  return coreData?.eventCode ? `${coreData?.eventCode}` : '';
};

const getLeadIdBasedOnWorkArea = (
  workAreaId: number | undefined,
  coreData: IEntityDetailsCoreData | undefined,
  customConfig: Record<string, unknown> | undefined
): string => {
  return workAreaId && MarvinQuickAddWorkAreaIds.includes(workAreaId)
    ? ''
    : getLeadId(coreData, customConfig);
};

const generateFormsDataFromProcessData = ({
  processData,
  onSuccess,
  customConfig,
  onShowFormChange,
  entityData,
  coreData,
  workAreaId
}: IGenerateFormsDataFromProcessData): null | IFormsConfiguration => {
  if (!processData) return null;
  const processRelatedData = generateFormsDataRelatedToProcessData({ processData });
  const formId = processData.Entity.FormId;
  const processFormConfig: IFormsConfiguration = {
    Config: {
      ...processRelatedData,
      FormId: formId,
      LeadId: getLeadIdBasedOnWorkArea(workAreaId, coreData, customConfig),
      OpportunityId: getOppId(coreData),
      EntityType: getEntityType(coreData),
      ActivityId:
        customConfig?.ActivityEvent && !customConfig?.isOpportunity
          ? (customConfig?.id as string)
          : undefined,
      ...(customConfig || {}),
      ...(entityData || {})
    },
    OnSuccess: onSuccess,
    OnShowFormChange: onShowFormChange
  };

  return processFormConfig;
};

interface IGetProcessDetailsBasedOnWorkAreaId {
  workAreaConfig: IWorkAreaConfig | undefined;
}
const getProcessDetailsBasedOnWorkAreaId = ({
  workAreaConfig
}: IGetProcessDetailsBasedOnWorkAreaId): null | IProcessResponse => {
  const { workAreaId } = workAreaConfig || {};
  const allProcessDetails: IProcessFormsData = getItem(StorageKey.Process) as IProcessFormsData;
  if (!allProcessDetails || !workAreaId || workAreaId === workAreaIds.NA) return null;
  if (allProcessDetails) {
    const key = getProcessKey(workAreaConfig);
    const workAreaProcessDetails = allProcessDetails[key];
    return workAreaProcessDetails;
  }
  return null;
};

const getProcessFormConfigBasedOnProcessId = ({
  workAreaId,
  processId,
  additionalData,
  onSuccess,
  onShowFormChange,
  entityData,
  customConfig,
  coreData,
  formId
}: IGetProcessDetailsBasedOnProcessId): IFormsConfiguration | null => {
  try {
    if (!workAreaId || !processId) return null;

    const allProcessDetails: IProcessFormsData = getItem(StorageKey.Process) as IProcessFormsData;

    if (!allProcessDetails) return null;

    const key = getProcessKey({ workAreaId: workAreaId, additionalData: additionalData });
    const workAreaProcessDetails = allProcessDetails[key];
    const formsConfigInformation = isDefaultForm({
      shouldContainDefaultForm: true,
      workAreaProcessDetails
    });

    if (formsConfigInformation.isNoForm) return null;

    const processActionOutput = findProcessActionOutput({
      workAreaProcessDetails,
      processId,
      formId
    });

    return generateFormsDataFromProcessData({
      processData: processActionOutput,
      onSuccess,
      onShowFormChange,
      entityData,
      customConfig,
      coreData,
      workAreaId
    });
  } catch (err) {
    trackError(err, 'error processing data');
    return null;
  }
};

export {
  getProcessDetailsBasedOnWorkAreaId,
  getProcessFormConfigBasedOnProcessId,
  findProcessActionOutput,
  generateFormsDataFromProcessData
};
