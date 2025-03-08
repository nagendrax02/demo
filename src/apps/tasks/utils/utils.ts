import { IProcessFormsData, IProcessMenuItem } from 'common/utils/process/process.types';
import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import { getProcessActionConfig, workAreaIds } from 'common/utils/process';
import { taskActions } from '../constants';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { formSubmissionConfig } from '../tasks.store';
import { IEntityDetailsCoreData } from '../../entity-details/types/entity-data.types';
import { ACTION } from '../../entity-details/constants';
import { EntityType } from '../../../common/types';
import { getEntityTaskAction } from '../components/default-tasks-page/utils';
import { getLeadType } from 'apps/entity-details/entitydetail.store';
import { LEAD_TYPE_ADDITIONAL_DATA_SEP } from 'common/constants';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

export const getConvertedAddTask = ({
  processFormsData,
  tabId,
  isLoading,
  coreData
}: {
  processFormsData: IProcessFormsData | null;
  tabId: string;
  isLoading: boolean;
  coreData: IEntityDetailsCoreData;
}): IActionWrapperItem => {
  const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
    getEntityTaskAction(tabId, coreData),
    processFormsData || {}
  );
  const hasOneForm = totalForms === 1;

  const entityType = coreData?.entityDetailsType;
  const eventCode = coreData?.eventCode ? `${coreData?.eventCode}` : undefined;
  const oppConvertedAction: IActionWrapperItem = {
    id: ACTION.OpportunityAddTask,
    workAreaConfig: {
      workAreaId: workAreaIds.OPPORTUNITY_DETAILS.ADD_TASK,
      additionalData: eventCode
    }
  };

  return {
    ...(entityType === EntityType.Opportunity ? oppConvertedAction : convertedAction),
    title: hasOneForm ? firstFormName : convertedAction?.title,
    isLoading: isLoading,
    subMenu: hasOneForm ? [] : convertedAction?.subMenu
  };
};

export const getAdditionalData = (
  taskType: string,
  eventCode?: string,
  leadType?: string
): string => {
  if (eventCode) {
    return `${eventCode}-${taskType}`;
  }
  if (leadType) {
    return `${taskType}${LEAD_TYPE_ADDITIONAL_DATA_SEP}${leadType}`;
  }
  return taskType;
};

export const getConvertedEditTask = (config: {
  processFormsData: IProcessFormsData | null;
  tabId: string;
  taskType: string;
  eventCode?: string;
}): IActionWrapperItem => {
  const { processFormsData, tabId, taskType, eventCode } = config;
  const workAreaConfig = {
    workAreaId: taskActions[tabId].EDIT_TASK.workAreaConfig.workAreaId,
    additionalData: getAdditionalData(taskType, eventCode, getLeadType())
  };
  const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
    { ...taskActions[tabId].EDIT_TASK, workAreaConfig: workAreaConfig },
    processFormsData || {}
  );
  const hasOneForm = totalForms === 1;
  return {
    ...convertedAction,
    toolTip: hasOneForm ? firstFormName : convertedAction?.toolTip,
    subMenu: hasOneForm ? [] : convertedAction?.subMenu
  };
};

export const showTaskProcessForm = async ({
  data,
  coreData,
  customConfig
}: {
  data: IProcessMenuItem;
  coreData: IEntityDetailsCoreData;
  customConfig?: Record<string, string>;
}): Promise<void> => {
  const processFormConfig = (
    await import('apps/forms/forms-process-integration')
  ).getProcessFormConfigBasedOnProcessId({
    workAreaId: data?.workAreaConfig?.workAreaId as number,
    processId: data?.value ?? '',
    additionalData: data?.workAreaConfig?.additionalData,
    customConfig: customConfig,
    formId: data?.formId,
    onSuccess: () => {
      formSubmissionConfig.isSuccessful = true;
    },
    onShowFormChange: (showForm: boolean) => {
      if (!showForm) {
        useFormRenderer.getState().setFormConfig(null);
        if (formSubmissionConfig.isSuccessful) {
          updateLeadAndLeadTabs();
          formSubmissionConfig.isSuccessful = false;
        }
      }
    },
    coreData
  });
  if (processFormConfig) {
    useFormRenderer.getState().setFormConfig(processFormConfig);
  }
};
