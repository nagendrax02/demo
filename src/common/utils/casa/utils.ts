import { trackError } from 'common/utils/experience/utils/track-error';
import { IDateOption } from 'common/component-lib/date-filter';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { getFromDB, getItem, setInDB, StorageKey } from '../storage-manager';
import { TABS_CACHE_KEYS } from 'apps/smart-views/components/custom-tabs/constants';
import { getTaskTypeOptions } from '../entity-data-manager/task';
import { CallerSource } from '../rest-client';
import { ITaskTypeOption } from '../entity-data-manager/task/task.types';
import { IAuthenticationConfig } from '../../types';
import { ICasaData, ITaskTypeFilter } from './casa.types';
import { getCasaData } from './casa-data';

const getTaskTypeFilterOptions = async (): Promise<ITaskTypeOption[]> => {
  const cachedTaskTypes = await getFromDB(StorageKey.TaskTypeFilterOptions);
  if (cachedTaskTypes) return cachedTaskTypes as ITaskTypeOption[];
  const response = await getTaskTypeOptions(CallerSource.ManageTasks);
  await setInDB(StorageKey.TaskTypeFilterOptions, response);
  return response;
};

const getTaskTypeFilterSelectedValue = async (casaData?: ICasaData): Promise<IOption[]> => {
  const selectedFilterData = casaData?.filters?.TaskType as ITaskTypeFilter;

  if (selectedFilterData?.category?.length) {
    const allTaskTypes = await getTaskTypeFilterOptions();
    const selectedTaskCategory: string = selectedFilterData?.category?.[0];
    return allTaskTypes
      ?.filter((type) => selectedTaskCategory === '-1' || type.Category === selectedTaskCategory)
      ?.map((type) => ({
        label: type.Name,
        value: type.Id
      }));
  }
  const selectedTaskIds = [
    ...(selectedFilterData.appointmentId || []),
    ...(selectedFilterData.todoId || [])
  ];

  return selectedTaskIds?.map((filter) => {
    return { label: '', value: filter };
  });
};

const getCurrentUserOption = (): IOption[] => {
  const userDetails = getItem(StorageKey.Auth) as IAuthenticationConfig;
  const userId = userDetails?.User?.Id;
  return [
    {
      label: '',
      value: userId
    }
  ];
};

const getDueDateFilterData = (casaData?: ICasaData): IDateOption => {
  const selectedFilterData = casaData?.filters?.DueDate as Record<string, string>;
  return {
    label: selectedFilterData?.label,
    value: selectedFilterData?.value,
    startDate: selectedFilterData?.startDate,
    endDate: selectedFilterData?.endDate
  };
};

const getStatusFilterData = (casaData?: ICasaData): IOption[] => {
  const selectedFilterData = casaData?.filters?.status as Record<string, string>;
  return [
    {
      label: selectedFilterData?.label,
      value: selectedFilterData?.value
    }
  ];
};

const filterDataMap: Record<
  string,
  (casaData?: ICasaData) => IDateOption | IOption[] | Promise<IOption[]>
> = {
  DueDate: getDueDateFilterData,
  status: getStatusFilterData,
  TaskType: getTaskTypeFilterSelectedValue,
  OwnerId: getCurrentUserOption
};

export const getSelectedFilterValueFromCasa = async (
  schema: string,
  currSelectedValue: IOption[] | IDateOption
): Promise<IDateOption | IOption[]> => {
  try {
    const svTabId = new URLSearchParams(location.search)?.get('activeTab');
    if (svTabId !== TABS_CACHE_KEYS.MANAGE_TASKS_TAB) {
      return currSelectedValue;
    }
    const casaData = getCasaData();

    if (casaData?.filters?.[schema] || schema === 'OwnerId') {
      if (filterDataMap?.[schema]) {
        return await filterDataMap?.[schema](casaData);
      }
    }
  } catch (err) {
    trackError(err);
  }
  return currSelectedValue;
};

export const getSelectedFiltersFromCasa = (selectedFilters: string[]): string[] => {
  try {
    const augmentedFilters: string[] = [];
    const svTabId = new URLSearchParams(location.search)?.get('activeTab');
    if (svTabId !== TABS_CACHE_KEYS.MANAGE_TASKS_TAB) {
      return selectedFilters;
    }

    const casaData = getCasaData();
    if (casaData?.filters) {
      Object.keys(casaData?.filters)?.forEach((casaFilter) => {
        if (casaFilter && !augmentedFilters.includes(casaFilter)) {
          augmentedFilters?.push(casaFilter);
        }
      });
    }

    augmentedFilters.push('OwnerId');

    return augmentedFilters;
  } catch (err) {
    trackError(err);
    return selectedFilters;
  }
};

export const getSearchTextFromCasa = (): string | undefined => {
  const casaTaskAutoId = new URLSearchParams(location.search)?.get('taskAutoId');
  const casaData = getCasaData();
  return casaTaskAutoId || casaData?.searchText;
};
