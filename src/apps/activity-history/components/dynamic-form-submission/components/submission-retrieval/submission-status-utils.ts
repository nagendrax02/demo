import { EntityType } from 'common/types';
import {
  IActivityField,
  ISubmissionStatusConfig,
  ISubmitRetrievalData,
  ITaskField,
  StatusType
} from './submission-retrieval.types';

const getStatusType = (submissionStatus: boolean | undefined): StatusType => {
  return submissionStatus ? StatusType.Success : StatusType.Failure;
};

const getLeadSubmissionStatusConfig = (
  isStatusEnabledInDFS: boolean,
  data: ISubmitRetrievalData,
  leadRepName?: string
): ISubmissionStatusConfig => {
  if (isStatusEnabledInDFS) {
    const leadStatusData = data?.FormEntity?.LeadSubmissionStatus;
    return {
      showStatus: true,
      type: getStatusType(leadStatusData),
      title: leadStatusData
        ? `${leadRepName ?? 'Lead'} saved successfully`
        : `${leadRepName ?? 'Lead'} updation failed`,
      reason: data?.FormEntity?.LeadSaveResponse
    };
  }
  return { showStatus: false };
};

const getActivityAndOpportunitySubmissionStatusConfig = (
  isStatusEnabledInDFS: boolean,
  data: IActivityField
): ISubmissionStatusConfig => {
  if (isStatusEnabledInDFS) {
    const successTitle = `${data?.DisplayName} saved successfully`;
    const failureTitle = `${data?.DisplayName} ${
      data?.ActivityId ? 'updation' : 'creation'
    } failed`;
    return {
      showStatus: true,
      type: getStatusType(data?.SubmissionStatus),
      title: data?.SubmissionStatus ? successTitle : failureTitle,
      reason: data?.ReasonForFailure
    };
  }
  return { showStatus: false };
};

const getTaskSubmissionStatusConfig = (
  isStatusEnabledInDFS: boolean,
  data: ITaskField
): ISubmissionStatusConfig => {
  if (isStatusEnabledInDFS) {
    const successTitle = `${data?.TaskTypeName} saved successfully`;
    const failureTitle = `${data?.TaskTypeName} ${data?.TaskId ? 'updation' : 'creation'} failed`;
    return {
      showStatus: true,
      type: getStatusType(data?.SubmissionStatus),
      title: data?.SubmissionStatus ? successTitle : failureTitle,
      reason: data?.ReasonForFailure
    };
  }
  return { showStatus: false };
};

const submissionStatusConfigMap: Record<
  string,
  (
    isStatusEnabledInDFS: boolean,
    data: ISubmitRetrievalData | IActivityField | ITaskField,
    leadRepName?: string
  ) => ISubmissionStatusConfig
> = {
  [EntityType.Lead]: getLeadSubmissionStatusConfig,
  [EntityType.Opportunity]: getActivityAndOpportunitySubmissionStatusConfig,
  [EntityType.Task]: getTaskSubmissionStatusConfig,
  [EntityType.Activity]: getActivityAndOpportunitySubmissionStatusConfig
};

export const getSubmissionStatusConfig = ({
  entityType,
  isStatusEnabledInDFS,
  data,
  leadRepName
}: {
  entityType: EntityType;
  isStatusEnabledInDFS: boolean;
  data: ISubmitRetrievalData | IActivityField | ITaskField;
  leadRepName?: string;
}): ISubmissionStatusConfig | undefined => {
  if (submissionStatusConfigMap?.[entityType]) {
    return submissionStatusConfigMap?.[entityType](isStatusEnabledInDFS, data, leadRepName);
  }
  return undefined;
};
