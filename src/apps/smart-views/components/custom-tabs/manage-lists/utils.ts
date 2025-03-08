import {
  IMarvinData,
  IResponseFilterConfig,
  ITabConfig,
  IAdvancedSearch,
  IRowCondition,
  IRecordType
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { ITabResponse, IUserPermission, ListType } from 'apps/smart-views/smartviews.types';
import { commonTabData, TABS_CACHE_KEYS } from '../constants';
import { safeParseJson } from 'common/utils/helpers';
import { getManageTabCache } from '../utils';
import { augmentTabData as createRawTabData } from 'apps/smart-views/utils/utils';
import { TabType } from 'apps/smart-views/constants/constants';
import {
  DEFAULT_COLUMNS,
  DEFAULT_FILTERS,
  DEFAULT_SORT_ON,
  LIST_SEND_EMAIL_LIMIT
} from './constants';
import { trackError } from 'common/utils/experience/utils/track-error';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { IListsSettingsConfigurations } from './manage-lists.types';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getLDTypeConfigFromRawData } from 'apps/smart-views/augment-tab-data/common-utilities/utils';

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
      cachedData?.TabContentConfiguration?.FetchCriteria?.PageSize ?? '25';
  } catch (error) {
    trackError(error);
  }
};

const getTabTitle = async (): Promise<string> => {
  try {
    const leadTypeConfiguration = await getLDTypeConfigFromRawData(
      TABS_CACHE_KEYS.MANAGE_LISTS_TAB
    );
    if (!leadTypeConfiguration) return 'Manage Lists';
    return `Manage ${leadTypeConfiguration?.[0]?.LeadTypeName ?? ''} Lists`;
  } catch (error) {
    trackError(error);
    return 'Manage Lists';
  }
};

const augmentTabData = async (
  tabData: ITabResponse,
  cachedData: ITabResponse | null
): Promise<void> => {
  tabData.entityManage = true;
  tabData.Type = TabType.Lists;

  tabData.Id = TABS_CACHE_KEYS.MANAGE_LISTS_TAB;
  tabData.TabConfiguration.Title = await getTabTitle();
  tabData.TabConfiguration.Description = 'Lists';

  const cachedMarvinData = (
    safeParseJson(
      cachedData?.TabContentConfiguration?.FetchCriteria?.AdditionalData || ''
    ) as IMarvinData
  )?.Marvin;

  const getSearchText = (): string => {
    return cachedMarvinData?.SearchText ?? '';
  };

  const additionalData: IMarvinData = {
    Marvin: {
      FilterValues: cachedMarvinData?.FilterValues || getDefaultFilters(),
      Exists: true,
      AdvancedSearchText: '',
      ['AdvancedSearchText_English']: '',
      Columns: DEFAULT_COLUMNS,
      SearchText: getSearchText(),
      SearchSortedOn: cachedMarvinData?.SearchSortedOn || DEFAULT_SORT_ON,
      tabColumnsWidth: cachedMarvinData?.tabColumnsWidth,
      RowHeightSelected: cachedMarvinData?.RowHeightSelected,
      ShowHidden: cachedMarvinData?.ShowHidden || false
    }
  };

  augmentFetchCriteria(tabData, cachedData, additionalData);
};

export const getListTabData = async (currTabData?: ITabConfig): Promise<ITabResponse> => {
  const tabData = safeParseJson(JSON.stringify(commonTabData)) as ITabResponse;
  const rawTabData = currTabData
    ? createRawTabData(tabData, currTabData)
    : await getManageTabCache(TABS_CACHE_KEYS.MANAGE_LISTS_TAB);

  augmentTabData(tabData, rawTabData);

  return tabData;
};

export const fetchUserPermissions = async (): Promise<IUserPermission> => {
  return {
    update: true,
    bulkUpdate: true,
    delete: true,
    bulkDelete: true,
    import: true,
    createActivity: true,
    bulkCreateActivity: true
  };
};

export const getListsConfigurations = async (): Promise<IListsSettingsConfigurations> => {
  const settingInfo = getItem(StorageKey.Setting) as Record<string, string | object>;
  const listsConfiguration = settingInfo?.ListsConfiguration as IListsSettingsConfigurations;
  if (!listsConfiguration) {
    try {
      const response = await httpGet<IListsSettingsConfigurations>({
        path: `${API_ROUTES.smartviews.listsConfiguration}?isBulkOperationRequest=true`,
        module: Module.Marvin,
        callerSource: CallerSource.ManageLists
      });
      settingInfo.ListsConfiguration = response;
      setItem(StorageKey.Setting, settingInfo);
      return response;
    } catch (error) {
      trackError(error);
      return {};
    }
  }
  return listsConfiguration;
};

const doesRowConditionContainsIsNotActivity = (rowCondition: IRowCondition[]): boolean => {
  return rowCondition?.some((row): boolean => {
    if (row?.LSO_Type?.toString()?.trim() === 'PAEvent') {
      return row?.Operator?.toString()?.trim() === 'neq';
    }
    return false;
  });
};

export const doesDefinitionContainsActivityIsNotCondition = (
  definition: string,
  isEssEnabledTenant?: boolean
): boolean => {
  if (isEssEnabledTenant) {
    const advancedSearchCriteria = safeParseJson(definition) as IAdvancedSearch;
    if (advancedSearchCriteria) {
      const conditions = advancedSearchCriteria?.Conditions;
      if (conditions?.length) {
        return conditions?.some((condition) => {
          if (condition?.Type?.trim() === 'Activity') {
            const rowConditions = condition.RowCondition;

            return doesRowConditionContainsIsNotActivity(rowConditions || []);
          }
          return false;
        });
      }
    }
  }
  return false;
};

const getDynamicListMessage = (record: IRecordType, isEssTenantEnabled?: boolean): string => {
  if (
    (record?.ListType as unknown as ListType) === ListType.DYNAMIC &&
    doesDefinitionContainsActivityIsNotCondition(record?.Definition || '', isEssTenantEnabled)
  ) {
    return `${record?.Name} contains 'Is Not' condition on Activity. Dynamic list with 'Is Not' condition on Activity is not supported in email campaign`;
  }
  return '';
};

const getEmailLimitMessage = (record: IRecordType, repName?: IEntityRepresentationName): string => {
  return Number(record?.MemberCount || 0) <= 0
    ? 'List is empty. Cannot send email'
    : `You can send Email to only upto 20000 ${repName?.PluralName ?? 'Leads'}  at a time.`;
};

const getLimitMessage = (record: IRecordType, repName?: IEntityRepresentationName): string => {
  if (
    Number(record?.MemberCount || 0) > LIST_SEND_EMAIL_LIMIT.MAX ||
    Number(record?.MemberCount || 0) < LIST_SEND_EMAIL_LIMIT.MIN
  ) {
    return getEmailLimitMessage(record, repName);
  }
  return '';
};

export const sendEmailDisableMessageForManageList = (
  record: IRecordType,
  repName?: IEntityRepresentationName,
  isEssTenantEnabled?: boolean
): string => {
  return (
    getLimitMessage(record, repName) || getDynamicListMessage(record, isEssTenantEnabled) || ''
  );
};
