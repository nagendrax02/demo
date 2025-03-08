import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from '../../constants';
import { CallerSource, Module, httpPost } from '../rest-client';
import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import {
  IProcessFormsData,
  IProcessResponse,
  IProcessPayload,
  IProcessEvent,
  IWorkAreaConfig,
  IProcessMenuItem
} from './process.types';
import { StorageKey, getItem, setItem } from '../storage-manager';
import { IGetProcessActionConfig } from 'apps/entity-details/types';

export const getProcessKey = (config?: IWorkAreaConfig): string => {
  const { workAreaId, additionalData } = config || {};
  if (additionalData) {
    return `${workAreaId}_${additionalData}`;
  }
  return `${workAreaId}`;
};

export const getWorkAreaProcessForms = (
  processFormsData: IProcessFormsData | null,
  workAreaKey: string
): IProcessResponse => {
  const processDataOfWorkArea = processFormsData?.[workAreaKey] as IProcessResponse;
  return processDataOfWorkArea;
};

const filterCompletedWorkAreas = (
  workAreaConfigs: IWorkAreaConfig[],
  processFormsData: IProcessFormsData
): IWorkAreaConfig[] => {
  return workAreaConfigs?.filter((config) => {
    const key = getProcessKey(config);
    const processDataOfWorkArea = getWorkAreaProcessForms(processFormsData, key);
    return processDataOfWorkArea?.Event?.LastEvaluatedProcess !== -1;
  });
};

export const getCachedProcessForms = (): IProcessFormsData => {
  return getItem(StorageKey.Process) || {};
};

export const isThereFormsToProcess = (config?: IWorkAreaConfig): boolean => {
  const processDataOfWorkArea = getCachedProcessForms();
  const key = getProcessKey(config);
  const processForms = getWorkAreaProcessForms(processDataOfWorkArea, key);
  return !!processForms?.ActionOutputs?.length;
};

export const filterCachedWorkAreas = (workAreaConfigs: IWorkAreaConfig[]): IWorkAreaConfig[] => {
  const cachedProcessFormsData = getCachedProcessForms();
  const filteredWorkAreas = filterCompletedWorkAreas(workAreaConfigs, cachedProcessFormsData);
  return filteredWorkAreas;
};

const generateRecursiveProcessPayload = (
  workAreaConfigs: IWorkAreaConfig[],
  processFormsData: IProcessFormsData | null
): IProcessPayload => {
  const payload: IProcessPayload = { triggerType: 4, applicationType: 1, Events: [] };
  const events: IProcessEvent[] = [];
  workAreaConfigs?.map((config) => {
    const key = getProcessKey(config);
    const processDataOfWorkArea = getWorkAreaProcessForms(processFormsData, key);
    if (processDataOfWorkArea?.Event) {
      events.push(processDataOfWorkArea?.Event);
    } else {
      events.push({
        WorkAreaId: config?.workAreaId,
        AdditionalData: config?.additionalData
      });
    }
  });
  payload.Events = events;
  return payload;
};

// filter out workAreas where LastEvaluatedProcess === -1
// if no workAreas, return
// else, fetchRecursiveProcessForms (with remaining workAreas)
export const fetchRecursiveProcessForms = async (
  workAreaConfigs: IWorkAreaConfig[],
  callerSource: CallerSource,
  processFormsData?: IProcessFormsData
): Promise<IProcessFormsData | undefined> => {
  try {
    if (!workAreaConfigs?.length) return processFormsData;

    const updatedProcessData = processFormsData || {};
    const payload = generateRecursiveProcessPayload(workAreaConfigs, updatedProcessData);
    const processForms: IProcessResponse[] = await httpPost({
      path: API_ROUTES.process,
      module: Module.Process,
      body: payload,
      callerSource
    });
    processForms?.map((item) => {
      const config = {
        workAreaId: item?.Event?.WorkAreaId as number,
        additionalData: item?.Event?.AdditionalData || ''
      };
      const key = getProcessKey(config);
      updatedProcessData[key] = {
        Event: item?.Event,
        ActionOutputs: [
          ...(updatedProcessData?.[key]?.ActionOutputs || []),
          ...(item?.ActionOutputs || [])
        ]
      };
    });
    const remainingWorkAreas = filterCompletedWorkAreas(workAreaConfigs, updatedProcessData);
    return await fetchRecursiveProcessForms(remainingWorkAreas, callerSource, updatedProcessData);
  } catch (error) {
    trackError(error);
  }
};

export const persistProcessData = (processFormsData: IProcessFormsData | null): void => {
  if (processFormsData) {
    const currentCache = getCachedProcessForms();
    setItem(StorageKey.Process, { ...currentCache, ...processFormsData });
  }
};

export const fetchMultipleWorkAreaProcessForms = async (
  workAreaConfigs: IWorkAreaConfig[],
  callerSource: CallerSource
): Promise<IProcessFormsData | undefined> => {
  const filteredWorkAreas = filterCachedWorkAreas(workAreaConfigs);
  const processForms = await fetchRecursiveProcessForms(filteredWorkAreas, callerSource);
  const cachedProcessFormsData = getCachedProcessForms();
  const finalData = { ...cachedProcessFormsData, ...processForms };
  persistProcessData(finalData);
  return finalData;
};

export const processFormsToSubMenu = (config: {
  workAreaConfig: IWorkAreaConfig;
  processFormsData: IProcessFormsData | null;
}): IProcessMenuItem[] | undefined => {
  const { workAreaConfig, processFormsData } = config || {};
  const key = getProcessKey(workAreaConfig);
  const processData = getWorkAreaProcessForms(processFormsData, key);
  const subMenu = processData?.ActionOutputs?.map((item) => ({
    label: item?.Entity?.DisplayProperty?.DisplayName,
    value: item?.ProcessId,
    workAreaConfig,
    formId: item?.Entity?.FormId
  }));
  // sort in ascending order based on label
  return subMenu?.sort((a, b) => a.label?.localeCompare(b.label));
};

export const convertToProcessAction = <T>({
  action,
  processFormsData
}: {
  action: T & IActionWrapperItem;
  processFormsData: IProcessFormsData;
}): T & IActionWrapperItem => {
  const workAreaConfig = action?.workAreaConfig;
  if (!workAreaConfig || !processFormsData) {
    return action;
  }
  const config = { workAreaConfig, processFormsData };
  const subMenu = processFormsToSubMenu(config);
  return {
    ...action,
    subMenu
  };
};

// eslint-disable-next-line complexity
export const getProcessActionConfig = <T>(
  action: T & IActionWrapperItem,
  processFormsData: IProcessFormsData | null
): IGetProcessActionConfig<T> => {
  if (!action?.workAreaConfig || !processFormsData) {
    return { convertedAction: action, firstFormName: '', totalForms: 0 };
  }
  const key = getProcessKey(action.workAreaConfig);
  const processesForWorkArea = getWorkAreaProcessForms(processFormsData, key);
  const totalForms = processesForWorkArea?.ActionOutputs?.length || 0;

  const actionOutput = processesForWorkArea?.ActionOutputs?.[0];
  const firstFormName = actionOutput?.Entity?.DisplayProperty?.DisplayName || '';
  const convertedAction = convertToProcessAction({
    action,
    processFormsData
  });
  return { convertedAction, firstFormName, totalForms };
};
