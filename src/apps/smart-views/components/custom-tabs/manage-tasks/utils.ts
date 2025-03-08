import { trackError } from 'common/utils/experience/utils/track-error';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { TABS_CACHE_KEYS, commonTabData } from '../constants';
import { safeParseJson } from 'common/utils/helpers';
import { SCHEMA_NAMES, TabType } from 'apps/smart-views/constants/constants';
import {
  CalendarView,
  IMarvinData,
  IResponseFilterConfig,
  ITabConfig
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { ALL_TASK_TYPES, DEFAULT_COLUMNS, DEFAULT_FILTERS, DEFAULT_SORT_ON } from './constants';
import { getManageTabCache } from '../utils';
import { CallerSource } from 'common/utils/rest-client';
import { CALENDAR_VIEW_MAP_CACHE_REVERSE } from 'apps/smart-views/augment-tab-data/task/constants';
import { IWorkAreaConfig } from 'common/utils/process/process.types';
import { workAreaIds } from 'common/utils/process';
import { augmentTabData as createRawTabData } from 'apps/smart-views/utils/utils';
import { getSearchTextFromCasa } from 'common/utils/casa/utils';
import { LEAD_TYPE_ADDITIONAL_DATA_SEP } from 'common/constants';

const getDefaultFilters = (): IResponseFilterConfig => {
  return DEFAULT_FILTERS.reduce((acc, curr) => {
    acc[curr] = {};
    return acc;
  }, {});
};

const augmentFetchCriteria = (
  tabData: ITabResponse,
  cachedData: ITabResponse | null,
  additionalData: IMarvinData
): void => {
  try {
    tabData.TabContentConfiguration.FetchCriteria.SelectedFilters = DEFAULT_FILTERS.join(',');
    tabData.TabContentConfiguration.FetchCriteria.AdditionalData = JSON.stringify(additionalData);
    tabData.TabContentConfiguration.FetchCriteria.PageSize =
      cachedData?.TabContentConfiguration?.FetchCriteria?.PageSize || '25';
  } catch (error) {
    trackError(error);
  }
};

const augmentTabdata = (tabData: ITabResponse, cachedData: ITabResponse | null): void => {
  tabData.entityManage = true;
  tabData.Type = TabType.Task;
  tabData.Id = TABS_CACHE_KEYS.MANAGE_TASKS_TAB;
  tabData.TabConfiguration.Title = 'Tasks';

  const cachedMarvinData = (
    safeParseJson(
      cachedData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
    ) as IMarvinData
  )?.Marvin;

  const getSearchText = (): string => {
    const casaSearchString = getSearchTextFromCasa();
    return casaSearchString || cachedMarvinData?.SearchText || '';
  };

  const additionalData: IMarvinData = {
    Marvin: {
      FilterValues: cachedMarvinData?.FilterValues || getDefaultFilters(),
      Exists: true,
      AdvancedSearchText: '',
      ['AdvancedSearchText_English']: '',
      Columns: cachedMarvinData?.Columns || DEFAULT_COLUMNS,
      SearchText: getSearchText(),
      SearchSortedOn: cachedMarvinData?.SearchSortedOn || DEFAULT_SORT_ON,
      tabColumnsWidth: cachedMarvinData?.tabColumnsWidth,
      RowHeightSelected: cachedMarvinData?.RowHeightSelected,
      ActiveTaskView: cachedMarvinData?.ActiveTaskView,
      ActiveCalendarView:
        cachedMarvinData?.ActiveCalendarView ?? CALENDAR_VIEW_MAP_CACHE_REVERSE[CalendarView.Day],
      ManageTasksTaskTypeColumn: cachedMarvinData?.ManageTasksTaskTypeColumn
    }
  };

  augmentFetchCriteria(tabData, cachedData, additionalData);
};

export const getManageTaskData = async (currTabData?: ITabConfig): Promise<ITabResponse> => {
  const tabData = safeParseJson(JSON.stringify(commonTabData)) as ITabResponse;
  const rawTabData = currTabData
    ? createRawTabData(tabData, currTabData)
    : await getManageTabCache(TABS_CACHE_KEYS.MANAGE_TASKS_TAB);

  augmentTabdata(tabData, rawTabData);

  return tabData;
};

export const fetchTaskProcessData = async ({
  tabId,
  taskTypeIds,
  workAreas,
  leadTypeInternalNames
}: {
  workAreas: Record<string, number>;
  tabId: string;
  taskTypeIds: string[];
  leadTypeInternalNames?: string;
}): Promise<void> => {
  try {
    const workAreasIds = [...Object.values(workAreas)];
    const workAreaConfig: IWorkAreaConfig[] = [];
    workAreasIds.forEach((workAreaId) => {
      if (workAreaId === workAreaIds.MANAGE_TASKS.EDIT) {
        return;
      }
      workAreaConfig.push({
        workAreaId,
        additionalData: tabId
      });
    });

    taskTypeIds.forEach((taskTypeId) => {
      let additionalData = `${taskTypeId ?? ''}`;
      if (leadTypeInternalNames?.length) {
        additionalData = `${additionalData}${LEAD_TYPE_ADDITIONAL_DATA_SEP}${leadTypeInternalNames}`;
      }

      workAreaConfig.push({
        workAreaId: workAreaIds.MANAGE_TASKS.EDIT,
        additionalData
      });
    });

    const fetchData = (await import('common/utils/process/process'))
      .fetchMultipleWorkAreaProcessForms;
    await fetchData(workAreaConfig, CallerSource.SmartViews);
  } catch (err) {
    trackError(err);
  }
};

export const getTaskFilterValueFromAdditionalData = (tabData: ITabResponse): string => {
  try {
    const marvinData = (
      safeParseJson(
        tabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
      ) as IMarvinData
    )?.Marvin;

    const taskTypeFilterValue = (
      marvinData?.FilterValues?.[SCHEMA_NAMES.TASK_TYPE]?.value || null
    )?.split(',');

    if (taskTypeFilterValue?.length === 1) {
      return taskTypeFilterValue?.[0];
    } else {
      return ALL_TASK_TYPES;
    }
  } catch (error) {
    trackError(error);
    return ALL_TASK_TYPES;
  }
};
