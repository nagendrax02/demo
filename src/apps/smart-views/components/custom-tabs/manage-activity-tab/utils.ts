import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { IMarvinData, IResponseFilterConfig } from '../../smartview-tab/smartview-tab.types';
import { safeParseJson } from 'common/utils/helpers';
import { commonTabData, TABS_CACHE_KEYS } from '../constants';
import { TabType } from 'apps/smart-views/constants/constants';
import {
  ACTIVITY_DEFAULT_FILTERS,
  ACTIVITY_DEFAULT_FILTERS_WITH_DATE,
  ActivityCodes,
  SALES_ACTIVITY_TAB_DEFAULT_FILTERS
} from 'apps/smart-views/augment-tab-data/activity/constants';
import { fetchCategoryMetadata } from 'apps/activity-history/utils';
import { IActivityCategoryMetadata } from 'apps/activity-history/types';
import { trackError } from 'common/utils/experience';
import { getActivityDefaultColumns } from 'apps/smart-views/augment-tab-data/activity/helpers';
import { DEFAULT_SORT_ON, EntityCode } from './constants';
import { getManageTabCache } from '../utils';
import { getUserStandardTimeZone } from '../../smartview-tab/utils';
import { EntityType } from 'common/utils/entity-data-manager/common-utils/common.types';
import { produce } from 'immer';

const getDefaultFilters = (entityCode: string): IResponseFilterConfig => {
  const defaultFilters =
    entityCode === ActivityCodes.SALES_ACTIVITY ||
    entityCode === ActivityCodes.CANCELLED_SALES_ACTIVITY
      ? SALES_ACTIVITY_TAB_DEFAULT_FILTERS
      : ACTIVITY_DEFAULT_FILTERS_WITH_DATE;
  return defaultFilters.reduce((acc, curr) => {
    acc[curr] = {};
    return acc;
  }, {});
};
export const getDefaultAdvanceSearch = (entityCode: string): string => {
  return `{"GrpConOp":"And","Conditions":[{"Type":"Activity","ConOp":"and","RowCondition":[{"SubConOp":"And","LSO":"ActivityEvent","LSO_Type":"PAEvent","Operator":"eq","RSO":"${entityCode}"}]}],"QueryTimeZone":"${getUserStandardTimeZone()}"}`;
};
export const augmentFetchCriteria = (
  tabData: ITabResponse,
  cachedData: ITabResponse | null,
  additionalData: IMarvinData
): void => {
  try {
    tabData.TabContentConfiguration.FetchCriteria.SelectedFilters =
      ACTIVITY_DEFAULT_FILTERS.join(',');
    tabData.TabContentConfiguration.FetchCriteria.SelectedColumns =
      additionalData.Marvin?.Columns?.join(',') ?? '';
    tabData.TabContentConfiguration.FetchCriteria.AdditionalData = JSON.stringify(additionalData);
    tabData.TabContentConfiguration.FetchCriteria.PageSize =
      cachedData?.TabContentConfiguration?.FetchCriteria?.PageSize ?? '25';
  } catch (error) {
    trackError(error);
  }
};
// eslint-disable-next-line complexity
const augmentTabdata = (
  cachedData: ITabResponse | null,
  selectedActivity: IActivityCategoryMetadata
): ITabResponse => {
  const tabData = JSON.parse(JSON.stringify(commonTabData)) as ITabResponse;
  tabData.entityManage = true;
  tabData.Type = TabType.Activity;
  tabData.Id = TABS_CACHE_KEYS.MANAGE_ACTIVITIES;
  tabData.TabConfiguration.Title = selectedActivity.Text;
  tabData.EntityCode = selectedActivity.Value;

  const cachedMarvinData = (
    safeParseJson(
      cachedData?.TabContentConfiguration?.FetchCriteria?.AdditionalData ?? ''
    ) as IMarvinData
  )?.Marvin;

  const additionalData: IMarvinData = {
    Marvin: {
      FilterValues: cachedMarvinData?.FilterValues || getDefaultFilters(tabData.EntityCode),
      Exists: true,
      AdvancedSearchText: !cachedMarvinData?.AdvancedSearchText
        ? getDefaultAdvanceSearch(selectedActivity.Value)
        : cachedMarvinData?.AdvancedSearchText,
      ['AdvancedSearchText_English']: '',
      Columns:
        cachedMarvinData?.Columns || getActivityDefaultColumns(tabData.EntityCode)?.split(','),
      SearchSortedOn: cachedMarvinData?.SearchSortedOn ?? DEFAULT_SORT_ON,
      tabColumnsWidth: cachedMarvinData?.tabColumnsWidth,
      RowHeightSelected: cachedMarvinData?.RowHeightSelected,
      EntityCode: cachedMarvinData?.EntityCode ?? tabData?.EntityCode,
      SearchText: cachedMarvinData?.SearchText ?? '',
      isManageEntityAdvancedSearchApplied: cachedMarvinData?.isManageEntityAdvancedSearchApplied
    }
  };
  augmentFetchCriteria(tabData, cachedData, additionalData);
  return tabData;
};

export const getManageActivityData = async (
  selectedActivity: IActivityCategoryMetadata
): Promise<ITabResponse> => {
  const rawTabData = await getManageTabCache(
    TABS_CACHE_KEYS.MANAGE_ACTIVITIES,
    selectedActivity.Value
  );
  return augmentTabdata(rawTabData, selectedActivity);
};

export const getActivityCodeFromURL = (): string => {
  const location = window?.location?.search?.toLowerCase();
  return new URLSearchParams(location)?.get(EntityCode) ?? '';
};

const addCancelledActivityToCategories = (
  categories: IActivityCategoryMetadata[],
  salesActivityOption: IActivityCategoryMetadata
): void => {
  try {
    if (salesActivityOption.Value !== ActivityCodes.SALES_ACTIVITY) return;
    const isCancelledSalesActivityExists = categories.some(
      (category) => category.Value === ActivityCodes?.CANCELLED_SALES_ACTIVITY
    );
    if (isCancelledSalesActivityExists) return;

    const updatedCategories = produce(categories, (draft) => {
      const cancelledOption = {
        ...salesActivityOption,
        Value: ActivityCodes.CANCELLED_SALES_ACTIVITY,
        Text: `${salesActivityOption.Text} - Cancelled`
      };
      draft.push(cancelledOption);
    });
    categories.splice(0, categories.length, ...updatedCategories);
  } catch (error) {
    trackError(error);
  }
};

export const getAugumentedActivities = async (): Promise<IActivityCategoryMetadata[]> => {
  try {
    let categories = await fetchCategoryMetadata();
    categories = categories.filter(
      (category) => category.EntityType == EntityType.Activity && !category.HideInActivityGrid
    );
    const salesActivityCategory = categories.find(
      (category) => category.Value === ActivityCodes.SALES_ACTIVITY
    );
    if (salesActivityCategory) {
      addCancelledActivityToCategories(categories, salesActivityCategory);
    }
    categories = categories.sort((a: IActivityCategoryMetadata, b: IActivityCategoryMetadata) => {
      const textA = a.Text?.toLowerCase() || '';
      const textB = b.Text?.toLowerCase() || '';
      if (textA === textB) return 0;
      if (textA > textB) return 1;
      return -1;
    });
    return categories;
  } catch (error) {
    trackError(error);
    return [];
  }
};
