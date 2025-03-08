import { trackError } from 'common/utils/experience/utils/track-error';
import { IProcessResponse } from 'common/utils/process/process.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { ITaskItem } from '../tasks.types';
import { generateFormsDataFromProcessData } from 'apps/forms/forms-process-integration';
import { SHOW_FORM } from '../constants';
import { formSubmissionConfig } from '../tasks.store';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { IEntityDetailsCoreData } from '../../entity-details/types/entity-data.types';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';
import { IFormsConfiguration } from 'apps/forms/forms.types';

export const getMarkTaskProcess = async (config: {
  task: ITaskItem;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  coreData: IEntityDetailsCoreData;
}): Promise<IFormsConfiguration | null> => {
  const { task, setIsLoading, coreData } = config;
  try {
    setIsLoading(true);
    const payload = {
      triggerType: 2,
      applicationType: 1,
      Events: [
        {
          taskTypeId: task.TaskType,
          AdditionalData: task.ID
        }
      ]
    };
    const processForms: IProcessResponse[] = await httpPost({
      path: API_ROUTES.process,
      module: Module.Process,
      body: payload,
      callerSource: CallerSource.Tasks
    });

    const actionOutput = processForms?.[0]?.ActionOutputs?.[0];
    if (actionOutput?.ActionType !== SHOW_FORM) {
      return null;
    }
    return generateFormsDataFromProcessData({
      processData: actionOutput || null,
      onSuccess: () => {
        formSubmissionConfig.isSuccessful = true;
      },
      customConfig: {
        IsFromMarkTaskComplete: true,
        TaskId: task?.ID,
        OpportunityId: task?.RelatedSubEntityId
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
  } catch (error) {
    trackError(error);
  }
  setIsLoading(false);
  return null;
};
