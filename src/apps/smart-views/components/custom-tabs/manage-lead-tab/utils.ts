import { trackError } from 'common/utils/experience/utils/track-error';
import { safeParseJson } from 'common/utils/helpers';
import { commonTabData, TABS_CACHE_KEYS } from '../constants';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { TabType } from 'apps/smart-views/constants/constants';
import { IMarvinData, ITabConfig } from '../../smartview-tab/smartview-tab.types';
import { DEFAULT_COLUMNS, DEFAULT_FILTERS } from './constants';
import { getDefaultFilters, getManageTabCache } from '../utils';
import { getUserStandardTimeZone } from '../../smartview-tab/utils';
import { defaultEntityLeadsSortOn } from '../related-leads-tab/constants';
import { isGlobalSearchPage } from 'common/utils/helpers/helpers';
import { augmentTabData as createRawTabData } from 'apps/smart-views/utils/utils';
import { updateSearchTextForGlobalSearch } from './augment';
import {
  getActiveAppTabId,
  updateTabConfig,
  ITabConfig as IAppTabConfig
} from 'common/component-lib/app-tabs-v2';
import { getLeadTypeInternalNameFromUrl } from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import { fetchRepresentationName } from 'common/utils/entity-data-manager/lead/metadata';
import { CallerSource } from 'common/utils/rest-client';
import { isLeadTypeEnabled } from 'common/utils/lead-type/settings';

const getTabTitle = async (): Promise<string> => {
  const repName = await fetchRepresentationName(CallerSource.ManageLeads);
  return `Manage ${repName?.PluralName ?? 'Leads'}`;
};

export const getDefaultAdvanceSearch = (): string => {
  const leadType = getLeadTypeInternalNameFromUrl();
  if (leadType) {
    return `{"GrpConOp":"And","Conditions":[{"Type":"Lead","ConOp":"or","RowCondition":[{"SubConOp":"And","LSO":"LeadType","LSO_Type":"string","Operator":"eq","RSO":"${leadType}","RSO_IsMailMerged":false},{"RSO":""},{"RSO":""}]}],"QueryTimeZone":"${getUserStandardTimeZone()}"}`;
  }
  return `{"GrpConOp":"And","Conditions":[{"Type":"Lead","ConOp":"or","RowCondition":[{"SubConOp":"And","LSO":"CreatedOn","LSO_Type":"DateTime","Operator":"eq","RSO":"opt-all-time","RSO_IsMailMerged":false},{"RSO":""},{"RSO":""}]}],"QueryTimeZone":"${getUserStandardTimeZone()}"}`;
};

export const getColumns = async (
  tabData: ITabResponse,
  cachedData: IMarvinData
): Promise<string[]> => {
  try {
    const leadTypeEnabled = await isLeadTypeEnabled(CallerSource.ManageLeads);
    if (leadTypeEnabled && !cachedData?.Marvin?.Columns) {
      const leadTypeSelectedColumns = await (
        await import('common/utils/lead-type/fetch-default-columns')
      )?.getLeadTypeBasedDefaultColumns(tabData);
      return leadTypeSelectedColumns?.split(',') || DEFAULT_COLUMNS;
    }
  } catch (error) {
    trackError(error);
  }
  return cachedData?.Marvin?.Columns || DEFAULT_COLUMNS;
};

// eslint-disable-next-line complexity, max-lines-per-function
export const getLeadTabData = async (currTabData?: ITabConfig): Promise<ITabResponse> => {
  const tabsData = safeParseJson(JSON.stringify(commonTabData)) as ITabResponse;
  const rawTabData = currTabData
    ? createRawTabData(tabsData, currTabData)
    : await getManageTabCache(TABS_CACHE_KEYS.MANAGE_LEADS_TAB);

  const cachedData = safeParseJson(
    rawTabData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
  ) as IMarvinData;
  const tabData = safeParseJson(JSON.stringify(commonTabData)) as ITabResponse;
  tabData.Type = TabType.Lead;
  tabData.Id = TABS_CACHE_KEYS.MANAGE_LEADS_TAB;
  tabData.entityManage = true;
  tabData.TabConfiguration.Title = await getTabTitle();
  tabData.TabContentConfiguration.FetchCriteria.PageSize =
    rawTabData?.TabContentConfiguration?.FetchCriteria?.PageSize ?? '25';
  const location = window?.location?.search?.toLowerCase();
  const searchedText =
    ((new URLSearchParams(location)?.get('key') || '') as string) || cachedData?.Marvin?.SearchText;

  const getAdvancedSearchText = (): string => {
    if (isGlobalSearchPage()) return getDefaultAdvanceSearch();
    return cachedData?.Marvin?.AdvancedSearchText || getDefaultAdvanceSearch();
  };

  const additionalData: IMarvinData = {
    Marvin: {
      ...(cachedData?.Marvin || {}),
      FilterValues: cachedData?.Marvin?.FilterValues || getDefaultFilters(DEFAULT_FILTERS),
      Exists: true,
      AdvancedSearchText: getAdvancedSearchText(),
      ['AdvancedSearchText_English']: '',
      Columns: await getColumns(tabData, cachedData),
      SearchText: searchedText || '',
      SearchSortedOn: cachedData?.Marvin?.SearchSortedOn || defaultEntityLeadsSortOn,
      tabColumnsWidth: cachedData?.Marvin?.tabColumnsWidth,
      RowHeightSelected: cachedData?.Marvin?.RowHeightSelected,
      quickFilter: cachedData?.Marvin?.quickFilter,
      prevFilter: cachedData?.Marvin?.prevFilter,
      isStarredList: cachedData?.Marvin?.isStarredList,
      listId: cachedData?.Marvin?.listId
    }
  };

  tabData.TabContentConfiguration.FetchCriteria.AdditionalData = JSON.stringify(additionalData);

  const newTabData = await updateSearchTextForGlobalSearch(tabData);
  return newTabData;
};

export const groupByCfsParentName = (columns: string): string => {
  try {
    const columnsGroupedByCfsParent = columns?.split(',').map((item) => {
      const parts = item.split('~');
      return parts[0];
    });
    return Array.from(new Set(columnsGroupedByCfsParent)).join(',');
  } catch (error) {
    trackError(error);
  }

  return columns;
};

export const updateAppTabConfig = ({ augmentedData }: { augmentedData: ITabConfig }): void => {
  const appTabConfig: Partial<IAppTabConfig> = {};
  const activeTabId = getActiveAppTabId();

  appTabConfig.title = `Manage ${augmentedData?.representationName?.PluralName || 'Leads'}`;

  updateTabConfig(activeTabId, appTabConfig);
};
