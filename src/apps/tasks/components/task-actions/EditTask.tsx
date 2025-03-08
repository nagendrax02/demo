import { trackError } from 'common/utils/experience/utils/track-error';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from './task-actions.module.css';
import { ActionWrapper, IActionWrapperItem } from 'common/component-lib/action-wrapper';
import { useState, lazy } from 'react';
import { taskActions } from '../../constants';
import { ITaskItem } from '../../tasks.types';
import { getConvertedEditTask, showTaskProcessForm } from '../../utils';
import Spinner from '@lsq/nextgen-preact/spinner';
import { formSubmissionConfig } from '../../tasks.store';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { CallerSource } from 'common/utils/rest-client';
import { IActionBtnForProcess } from 'apps/entity-details/components/vcard/actions/button-actions/button-actions.types';
import { IEntityDetailsCoreData } from '../../../entity-details/types/entity-data.types';
import { EntityType } from 'common/types';
import { workAreaIds } from 'common/utils/process';
import { ACTION } from '../../../entity-details/constants';
import { RecordType, useTabRecordCounter } from 'common/component-lib/tab-record-counter';
import { getAdditionalData } from '../../utils/utils';
import { getLeadType } from 'apps/entity-details/entitydetail.store';
import { IProcessMenuItem } from 'common/utils/process/process.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IEditTask {
  tabId: string;
  taskItem: ITaskItem;
  coreData: IEntityDetailsCoreData;
}

const EditTask = ({ tabId, taskItem, coreData }: IEditTask): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<IActionWrapperItem>({ toolTip: 'Edit' });
  const { updateTabRecordCount } = useTabRecordCounter();

  const customProcessConfig = {
    Name: `Edit ${taskItem?.Name}`,
    EntityType: taskItem?.TaskType,
    TaskId: taskItem?.ID,
    OpportunityId: taskItem?.RelatedSubEntityId
  };

  const { entityDetailsType, eventCode } = coreData;

  const eventCodeString = eventCode ? `${eventCode}` : undefined;

  const getProcessAction = (
    type: EntityType,
    convertedAction: IActionWrapperItem
  ): IActionBtnForProcess => {
    if (type === EntityType.Opportunity) {
      return {
        title: 'Tasks',
        workAreaConfig: convertedAction?.workAreaConfig
          ? convertedAction?.workAreaConfig
          : {
              workAreaId: workAreaIds.OPPORTUNITY_DETAILS.EDIT_TASK,
              additionalData: eventCodeString
            },
        id: ACTION.OpportunityEditTask
      };
    }
    return {
      workAreaConfig: convertedAction?.workAreaConfig,
      id: taskActions[tabId].EDIT_TASK.name,
      title: taskActions[tabId].EDIT_TASK.name
    };
  };

  const handleButtonProcess = async (convertedAction: IActionWrapperItem): Promise<void> => {
    const processActionClickHandler = await import(
      'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
    );
    const formConfig = await processActionClickHandler.getFormConfig({
      action: getProcessAction(entityDetailsType, convertedAction),
      customConfig: customProcessConfig,
      onSuccess: () => {
        formSubmissionConfig.isSuccessful = true;
      },
      onShowFormChange: (show: boolean) => {
        if (!show) {
          useFormRenderer.getState().setFormConfig(null);
          if (formSubmissionConfig.isSuccessful) {
            updateLeadAndLeadTabs();
            updateTabRecordCount(coreData?.entityIds?.lead, RecordType.Task);
            formSubmissionConfig.isSuccessful = false;
          }
        }
      },
      coreData
    });
    useFormRenderer.getState().setFormConfig(formConfig);
  };

  const handleMenuItemSelect = async (data: IProcessMenuItem): Promise<void> => {
    await showTaskProcessForm({
      data,
      customConfig: customProcessConfig,
      coreData
    });
  };

  const handleEditTask = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const fetchData = (await import('common/utils/process/process'))
        .fetchMultipleWorkAreaProcessForms;
      const processForms = await fetchData(
        [
          {
            workAreaId: taskActions[tabId].EDIT_TASK.workAreaConfig.workAreaId,
            additionalData: getAdditionalData(taskItem?.TaskType, eventCodeString, getLeadType())
          }
        ],
        CallerSource.Tasks
      );
      const convertedAction = getConvertedEditTask({
        processFormsData: processForms || {},
        tabId,
        taskType: taskItem?.TaskType,
        eventCode: eventCodeString
      });
      if (!convertedAction?.subMenu?.length) {
        await handleButtonProcess(convertedAction);
      }
      setAction(convertedAction);
    } catch (error) {
      trackError(error);
    }
    setIsLoading(false);
  };

  const getIcon = (): JSX.Element => {
    return isLoading ? (
      <Spinner customStyleClass={styles.edit_spinner} />
    ) : (
      <Icon name="edit" variant={IconVariant.Filled} />
    );
  };

  return (
    <ActionWrapper
      menuKey={`${action?.id}`}
      action={action || {}}
      id={action?.id || ''}
      onMenuItemSelect={handleMenuItemSelect}>
      <Button
        text=""
        onClick={handleEditTask}
        icon={getIcon()}
        customStyleClass={styles.task_edit_delete}
        dataTestId="tasks-edit-action"
      />
    </ActionWrapper>
  );
};

export default EditTask;
