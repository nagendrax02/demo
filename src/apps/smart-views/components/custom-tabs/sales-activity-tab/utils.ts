import { IFetchCriteria, ITabResponse } from 'apps/smart-views/smartviews.types';
import { TABS_CACHE_KEYS, commonTabData } from '../constants';
import { safeParseJson } from 'common/utils/helpers';
import {
  defaultSalesActivityColumn,
  defaultSalesActivityFilter,
  defaultSalesActivitySortOn
} from './constants';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { SALES_ACTIVITY_CODE, TabType } from 'apps/smart-views/constants/constants';
import { ICacheConfig, fetchTabData } from '../utils';
import { CallerSource } from 'common/utils/rest-client';
import { IMarvinData, IResponseFilterConfig } from '../../smartview-tab/smartview-tab.types';

// eslint-disable-next-line max-lines-per-function
export const getSalesActivityAdvancedSearch = (accountId?: string): string =>
  JSON.stringify({
    GrpConOp: 'And',
    Conditions: [
      {
        Type: 'Activity',
        ConOp: 'and',
        RowCondition: [
          {
            SubConOp: 'And',
            LSO: 'ActivityEvent',
            ['LSO_Type']: 'PAEvent',
            Operator: 'eq',
            RSO: '30'
          },
          {
            SubConOp: 'And',
            LSO: 'StatusReason',
            ['LSO_Type']: 'PAEvent',
            Operator: 'eq',
            RSO: '0'
          }
        ]
      },
      {
        Type: 'Lead',
        ConOp: 'and',
        RowCondition: [
          {
            SubConOp: 'And',
            LSO: 'RelatedCompanyId',
            ['LSO_Type']: 'String',
            Operator: 'eq',
            RSO: accountId || ''
          }
        ]
      }
    ],
    QueryTimeZone: 'India Standard Time'
  });

const getDefaultFilters = (): IResponseFilterConfig => {
  return defaultSalesActivityFilter?.split(',')?.reduce((acc, curr) => {
    acc[curr] = {};
    return acc;
  }, {});
};

const createFetchCriteriaValues = (
  cachedData: ICacheConfig | undefined,
  additionalData: IMarvinData
): Partial<IFetchCriteria> => {
  const defaultSelectedFilters =
    cachedData?.defaultValues?.defaultFilters.join(',') ?? defaultSalesActivityFilter;
  const selectedFilters = cachedData?.selectedFilters?.join(',') ?? defaultSelectedFilters;
  const selectedColumns =
    cachedData?.selectedColumns?.join(',') ??
    cachedData?.defaultValues?.defaultColumns?.join(',') ??
    defaultSalesActivityColumn;
  const sortedOn = cachedData?.sortedOn ?? defaultSalesActivitySortOn;
  const pageSize = String(cachedData?.pageSize ?? 25);

  return {
    SelectedFilters: selectedFilters,
    AdditionalData: JSON.stringify(additionalData),
    SelectedColumns: selectedColumns,
    SortedOn: sortedOn,
    PageSize: pageSize
  };
};

export const getSalesActivityTabData = async ({
  entityIds
}: IEntityDetailsCoreData): Promise<ITabResponse> => {
  const cachedData = (await fetchTabData(
    TABS_CACHE_KEYS.SALES_ACTIVITY_TAB,
    CallerSource.AccountDetails
  )) as ICacheConfig;

  const tabData = safeParseJson(JSON.stringify(commonTabData)) as ITabResponse;
  tabData.EntityCode = SALES_ACTIVITY_CODE;
  tabData.Id = TABS_CACHE_KEYS.SALES_ACTIVITY_TAB;
  tabData.TabConfiguration.Title = 'Sales Activity Tab';
  tabData.Type = TabType.Activity;

  const additionalData: IMarvinData = {
    Marvin: {
      FilterValues: cachedData ? cachedData.filters || {} : getDefaultFilters(),
      Exists: true,
      ['AdvancedSearchText_English']: '',
      Columns: cachedData
        ? cachedData.selectedColumns ?? cachedData.defaultValues?.defaultColumns
        : defaultSalesActivityColumn.split(','),
      SearchText: cachedData?.searchText,
      SearchSortedOn: cachedData?.sortedOn ?? defaultSalesActivitySortOn,
      AdvancedSearchText: getSalesActivityAdvancedSearch(entityIds?.account),
      tabColumnsWidth: cachedData?.tabWidthConfig,
      RowHeightSelected: cachedData?.rowHeight
    }
  };

  tabData.TabContentConfiguration.FetchCriteria = {
    ...tabData.TabContentConfiguration.FetchCriteria,
    ...createFetchCriteriaValues(cachedData, additionalData)
  };
  tabData.TabContentConfiguration.Actions = {
    HiddenActions: '101,102'
  };

  return { ...tabData };
};
