import { API_ROUTES } from 'common/constants';
import { IDateFilter, ITaskItem, ITaskRequestBody, ITaskResponse } from '../tasks.types';
import { CallerSource, Module, httpGet, httpPost } from 'common/utils/rest-client';
import { TaskFilterData, alertConfig, taskStatus } from '../constants';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';

const generateFetchTasksBody = (config: {
  date?: IDateFilter;
  statusCode?: number;
  leadId: string;
  opportunityId?: string;
  sortDirection?: number;
  page?: number;
}): ITaskRequestBody => {
  const { date, statusCode, leadId, opportunityId, sortDirection, page } = config;
  return {
    Parameter: {
      FromDate: date?.startDate,
      ToDate: date?.endDate,
      StatusCode: statusCode ?? -1,
      Id: leadId,
      RelatedSubEntityId: opportunityId || ''
    },
    Sorting: {
      Direction: sortDirection || 1
    },
    Paging: {
      PageIndex: page || 1,
      PageSize: 25
    }
  };
};

export const fetchTasks = async (config: {
  date?: IDateFilter | undefined;
  statusCode?: number;
  leadId: string;
  page?: number;
  opportunityId?: string;
}): Promise<ITaskResponse> => {
  const body = generateFetchTasksBody(config);

  const response = (await httpPost({
    path: API_ROUTES.tasksGet,
    module: Module.Marvin,
    body,
    callerSource: CallerSource.Tasks
  })) as { Data: ITaskItem[]; TotalRecords: number };

  return {
    totalTasks: response?.TotalRecords,
    tasksList: response?.Data
  };
};

export const fetchTaskStatus = async (): Promise<IOption[]> => {
  return TaskFilterData;
};

const updateTaskStatus = (
  taskList: ITaskItem[],
  taskId: string,
  statusCode: number | undefined
): ITaskItem[] => {
  return taskList?.map((task) => {
    if (task?.ID === taskId) {
      task.Status = statusCode;
      task.CompletedOnString = new Date().toISOString();
    }
    return task;
  });
};

export const handleMarkTask = async (config: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  taskItem: ITaskItem;
  showAlert: (notification: INotification) => void;
  setTasksList: (data: ITaskResponse) => void;
  tasksList: ITaskItem[];
  totalTasks: number;
  onSuccess?: () => Promise<void>;
}): Promise<void> => {
  const { setIsLoading, taskItem, showAlert, setTasksList, tasksList, totalTasks, onSuccess } =
    config;
  // currentStatus
  const isCompleted = taskItem?.Status === taskStatus.COMPLETED;
  setIsLoading(true);
  const path = isCompleted ? API_ROUTES.markTaskOpen : API_ROUTES.markTaskComplete;
  try {
    await httpGet({
      path: `${path}?throwNotifyError=true&id=${taskItem?.ID}`,
      module: Module.Marvin,
      callerSource: CallerSource.Tasks
    });
    const updatedTaskList = updateTaskStatus(
      tasksList,
      taskItem?.ID,
      !isCompleted ? taskStatus.COMPLETED : taskStatus.PENDING
    );
    setTasksList({
      tasksList: updatedTaskList,
      totalTasks
    });
    updateLeadAndLeadTabs();
    if (onSuccess) onSuccess();
    showAlert(alertConfig.TASK_STATUS_CHANGE_SUCCESS);
  } catch (error) {
    console.log(error);
    showAlert(isCompleted ? alertConfig.TASK_OPEN_FAIL : alertConfig.TASK_COMPLETE_FAIL);
  }
  setIsLoading(false);
};

export const removeTaskFromList = (config: {
  tasksList: ITaskItem[];
  setTasksList: (data: ITaskResponse) => void;
  taskId: string;
  totalTasks: number;
}): void => {
  const { taskId, tasksList, setTasksList, totalTasks } = config;
  const updatedTaskList = tasksList?.filter((task) => task?.ID !== taskId);
  setTasksList({
    tasksList: updatedTaskList,
    totalTasks
  });
};

interface IFetchNextPage {
  pageNumber: number | undefined;
  setTasksList: (data: ITaskResponse) => void;
  currentTasks: ITaskItem[];
  date: IDateFilter;
  statusCode: number;
  leadId: string;
  showAlert: (notification: INotification) => void;
  opportunityId?: string;
}

export const fetchNextPage = async (config: IFetchNextPage): Promise<number> => {
  const {
    pageNumber,
    setTasksList,
    currentTasks,
    date,
    leadId,
    statusCode,
    showAlert,
    opportunityId
  } = config;
  let length = 0;
  try {
    const { totalTasks, tasksList } = await fetchTasks({
      page: pageNumber,
      statusCode,
      leadId,
      date,
      opportunityId
    });
    if (tasksList?.length) {
      setTasksList({
        tasksList: [...(currentTasks || []), ...(tasksList || [])],
        totalTasks
      });
      length = tasksList?.length;
    }
  } catch (error) {
    console.log(error);
    showAlert(alertConfig.GENERIC);
  }
  return length;
};
