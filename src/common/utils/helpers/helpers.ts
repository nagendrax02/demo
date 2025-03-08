import { trackError } from 'common/utils/experience/utils/track-error';
import {
  APP_VISIBILITY_CHANGED,
  ENV_CONFIG,
  APP_ROUTE,
  API_ROUTES,
  ENTITY_STORE_RESET_KEY
} from 'common/constants';
import {
  ClassValue,
  IMipPreReqData,
  IOpenOpportunityDetailsTab,
  MipData,
  MipPreReqData
} from './helpers.types';
import { EntityType } from 'common/types';
import { getPersistedAuthConfig } from '../authentication';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { StorageKey, getItem, setItem } from '../storage-manager';
import { ITabConfig } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { OptionSeperator } from 'apps/smart-views/components/smartview-tab/components/filter-renderer/constants';
import { IDateOption } from 'common/component-lib/date-filter';
import { CallerSource } from '../rest-client';
import { IActivityDetails } from 'common/component-lib/activity-table/utils/config/data-fetcher';
import { IField } from 'common/component-lib/activity-table/activity-table.types';
import { ActivityBaseAttributeDataType, DataType } from 'common/types/entity/lead';
import { getFormattedDateTime } from '../date';
import { IActivityFields } from 'common/component-lib/modal/activity-details-modal/activity-details.types';
import { ICachedAccountDetails } from 'common/types/entity/account/cache.types';
import { AvailableTheme, getCurrentTheme } from '@lsq/nextgen-preact/v2/stylesmanager';
import { getAccountActivityMetaData } from '../entity-data-manager/account-activity';
import { MXDATASEPERATOR } from '../entity-data-manager/contants';
import {
  getFullScreenEntityTypeCode,
  getFullScreenSelectedRecordId,
  getFullScreenTabType
} from 'common/component-lib/full-screen-header/full-screen.store';
import { settingKeys } from './settings';
import { publishExternalAppEvent } from 'apps/external-app';

export const safeParseJson = <T>(stringifiedJSON: string): T | null => {
  try {
    if (!stringifiedJSON) return null;

    if (typeof stringifiedJSON === 'string') {
      return JSON.parse(stringifiedJSON) as T;
    }
    return stringifiedJSON as T;
  } catch (ex) {
    trackError(ex);
    return null;
  }
};

export const isValidGUID = (input: string): boolean => {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return !!(input && regex.test(input));
};

export const getLeadName = (record: Record<string, string | null>): string => {
  const { FirstName = '', LastName = '', EmailAddress } = record;
  if (FirstName || LastName) {
    return `${FirstName || ''} ${LastName || ''}`.trim();
  }
  return EmailAddress || '[No Name]';
};

export const getEnvConfig = (key: string): string | Record<string, string> => {
  return self?.[ENV_CONFIG.envKey]?.[key] as string | Record<string, string>;
};

export const getApiUrl = (key: string): string => {
  return getEnvConfig(ENV_CONFIG.apiURL)?.[key] as string;
};

export const isMiP = (): boolean => {
  return !!document?.getElementById('mip_pre_reqdata');
};

export const getEntityId = (): string => {
  try {
    if (getFullScreenSelectedRecordId() && getFullScreenTabType() === EntityType.Lead)
      return getFullScreenSelectedRecordId();
    const location = window?.location?.search?.toLowerCase();
    return (
      new URLSearchParams(location)?.get('leadid') || new URLSearchParams(location)?.get('id') || ''
    );
  } catch (ex) {
    trackError(ex);
    return '';
  }
};

export const getAccountId = (): string => {
  try {
    if (getFullScreenSelectedRecordId()) return getFullScreenSelectedRecordId();
    const location = window?.location?.search?.toLowerCase();
    if (!location) {
      return window?.location?.pathname?.split('/')?.[3];
    }
    return new URLSearchParams(location)?.get('accountid') || '';
  } catch (ex) {
    trackError(ex);
    return '';
  }
};

export const isGlobalSearchPage = (): boolean => {
  const location = window?.location?.pathname?.toLowerCase();
  if (location === APP_ROUTE.search) {
    return true;
  }
  return false;
};

export const getAccountTypeId = (): string => {
  try {
    const location = window?.location?.search?.toLowerCase();
    if (!location) {
      const ids = (getItem(StorageKey.ADType) as Record<string, string>) || {};
      return ids[getAccountId()];
    }
    return new URLSearchParams(location)?.get('accounttype') || '';
  } catch (ex) {
    trackError(ex);
    return '';
  }
};

export const getAccountTypeName = (): string => {
  try {
    const location = window?.location?.pathname?.split('/')?.[2];
    if (!location) {
      const details =
        (getItem(StorageKey.ADCompoundData) as Record<string, ICachedAccountDetails>) || {};
      return details?.[getAccountId()]?.AccountTypeName || '';
    }
    return location;
  } catch (ex) {
    trackError(ex);
    return '';
  }
};

export const getOpportunityId = (): string => {
  try {
    if (getFullScreenSelectedRecordId() && getFullScreenTabType() === EntityType.Opportunity)
      return getFullScreenSelectedRecordId();
    const location = window?.location?.search?.toLowerCase();
    return new URLSearchParams(location)?.get('opportunityid') || '';
  } catch (ex) {
    trackError(ex);
    return '';
  }
};

export const getOpportunityEventCode = (): number => {
  try {
    if (getFullScreenEntityTypeCode() && getFullScreenTabType() === EntityType.Opportunity)
      return parseInt(getFullScreenEntityTypeCode(), 10);
    const location = window?.location?.search?.toLowerCase();
    const eventCodeString = new URLSearchParams(location)?.get('opportunityevent');
    return parseInt(eventCodeString || '', 10);
  } catch (ex) {
    trackError(ex);
    return -1;
  }
};

export const getTabDetailId = (): string => {
  try {
    if (getAccountId()) return getAccountId();
    else if (getOpportunityEventCode()) return `${getOpportunityEventCode()}`;
    else if (getEntityId()) return getEntityId();
  } catch (ex) {
    trackError(ex);
  }
  return '';
};

export const getOpportunityTypeName = (): string => {
  try {
    return `OpportunityManagement?ec=${getOpportunityEventCode()}`;
  } catch (ex) {
    trackError(ex);
    return '';
  }
};

export const isValidGuid = (str: string): boolean => {
  const guidPattern =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return guidPattern.test(str);
};

export const getWithZValue = (date: string): string => {
  if (!date?.trim()) return date;
  return date + 'Z';
};

export const sleep = async (timeout: number): Promise<void> =>
  new Promise((r) => setTimeout(r, timeout));

export const isMouseInsideComponent = (mouseRef: MouseEvent, compRef: HTMLSpanElement): boolean => {
  const rect = compRef.getBoundingClientRect();
  const { clientX, clientY } = mouseRef;
  return (
    clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
  );
};

export const generateUUIDv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getUUId = (): string => {
  try {
    if (typeof crypto?.randomUUID === 'function') {
      return crypto?.randomUUID();
    }

    return generateUUIDv4();
  } catch (error) {
    trackError(error);
  }
  const userConfig = getPersistedAuthConfig()?.User;
  return `${Date?.now()}-${userConfig?.Id || ''}`;
};

export const isMouseOut = (
  mouseRef: MouseEvent,
  inputRef: HTMLDivElement | null,
  popupRef: HTMLDivElement | null
): boolean | null => {
  return (
    inputRef &&
    popupRef &&
    !isMouseInsideComponent(mouseRef, inputRef) &&
    !isMouseInsideComponent(mouseRef, popupRef)
  );
};

export const handleMouseEvents = (
  show: boolean,
  handleMouseClick: (event) => void
): (() => void) => {
  if (show) document.addEventListener('mousedown', handleMouseClick);
  else document.removeEventListener('mousedown', handleMouseClick);

  return (): void => {
    document.removeEventListener('mousedown', handleMouseClick);
  };
};

export const isMobileDevice = (): boolean => {
  return typeof window === 'object' && window.matchMedia('(max-width: 768px)').matches;
};

type KeyOfType<T> = keyof T;
export function createHashMapFromArray<T>(
  arrayOfObjects: T[],
  keyProperty: KeyOfType<T>
): Record<string, T> {
  if (!arrayOfObjects?.length || !keyProperty) {
    return {};
  }

  const hashMap: Record<string, T> = {};

  arrayOfObjects.forEach((obj) => {
    const key = obj[keyProperty];

    if (key !== undefined) {
      hashMap[String(key)] = obj;
    }
  });

  return hashMap;
}

export const handleEntityUpdate = (leadId?: string, oppId?: string): void => {
  if (oppId) {
    // publishOpportunityAppUpdate(oppId);
  } else if (leadId) {
    updateLeadAndLeadTabs();
  }
};

const getIsAppTabsEnabledFromCache = (): boolean => {
  const setting = getItem(StorageKey.Setting) as Record<string, string>;

  return setting?.[settingKeys.EnableAppTabsForMarvinSWLite] === '1';
};

export const openEntityDetailsPagesInPlatform = ({
  entity,
  id,
  eventCode,
  accountType,
  openInNewTab
}: {
  entity: string;
  id: string;
  eventCode?: string | number;
  accountType?: string;
  openInNewTab?: boolean;
}): void => {
  const appTabsEnabled = getIsAppTabsEnabledFromCache();
  const target = openInNewTab ? '_blank' : '_self';
  let path: string = '';
  switch (entity) {
    case EntityType.Opportunity:
      path = `/OpportunityManagement/OpportunityDetails?opportunityId=${id}&opportunityEvent=${eventCode}`;
      break;
    case EntityType.Lead:
      path = `/LeadManagement/LeadDetails?LeadID=${id}`;
      break;
    case EntityType.Account:
      path = `/AccountManagement/${accountType}/${id}`;
      break;
  }
  if (appTabsEnabled) {
    window.history.pushState({}, '', path);
  } else {
    window.open(path, target);
  }
};

export const openEntityDetailsPagesInStandalone = ({
  entity,
  id,
  eventCode,
  accountTypeId,
  openInNewTab
}: {
  entity: string;
  id: string;
  eventCode?: string | number;
  accountTypeId?: string;
  openInNewTab?: boolean;
}): void => {
  const target = openInNewTab ? '_blank' : '_self';
  switch (entity) {
    case EntityType.Opportunity:
      window.open(`/OpportunityDetails?opportunityId=${id}&opportunityEvent=${eventCode}`, target);
      break;
    case EntityType.Lead:
      window.open(`/LeadDetails?LeadID=${id}`, target);
      break;
    case EntityType.Account:
      window.open(`/AccountDetails?accountId=${id}&accountType=${accountTypeId}`, target);
      break;
  }
};

export const openOpportunityDetailsTab = ({
  entityId,
  eventCode,
  openInNewTab
}: IOpenOpportunityDetailsTab): void => {
  if (!isMiP()) {
    openEntityDetailsPagesInStandalone({
      entity: EntityType.Opportunity,
      id: entityId,
      eventCode: eventCode,
      openInNewTab
    });
  } else {
    openEntityDetailsPagesInPlatform({
      entity: EntityType.Opportunity,
      id: entityId,
      eventCode: eventCode,
      openInNewTab
    });
  }
};

export const openLeadDetailTab = (leadId: string, openInNewTab?: boolean): void => {
  if (!isMiP()) {
    openEntityDetailsPagesInStandalone({ entity: EntityType.Lead, id: leadId, openInNewTab });
  } else {
    openEntityDetailsPagesInPlatform({ entity: EntityType.Lead, id: leadId, openInNewTab });
  }
};

export const isEmailValid = (val: string | undefined): boolean => {
  try {
    let isValid = true;
    if (val) {
      const validEmailRegex =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
      isValid = validEmailRegex.test(val);
    }
    return isValid;
  } catch (error) {
    trackError('Utils Error - isEmailValid', error);
    return false;
  }
};

export const getMiPPreReqData = (): IMipPreReqData | undefined => {
  try {
    if (!self[MipData])
      self[MipData] = safeParseJson(
        (document.getElementById(MipPreReqData) as HTMLInputElement)?.value
          ?.replaceAll('&quot;', '"')
          .replaceAll('&amp;', '&')
      ) as IMipPreReqData;
    return self[MipData] as IMipPreReqData;
  } catch (ex) {
    trackError(ex);
    return undefined;
  }
};

export const getProfileName = (profileName: string): string => {
  try {
    const fullName = profileName?.trim();
    if (fullName === '') {
      return '';
    }
    const splitName = fullName?.split(' ');
    let sortName: string;
    if (splitName.length === 1) {
      sortName = splitName?.[0]?.[0].toUpperCase();
    } else {
      sortName = `${splitName?.[0]?.[0]?.toUpperCase()}${splitName?.[1]?.[0]?.toUpperCase()}`;
    }
    return sortName;
  } catch (e) {
    // eslint-disable-next-line no-console
    trackError(e);
  }
  return '';
};

export const removeDuplicateObjects = <T>(array: T[]): T[] => {
  const uniqueArray = array.filter((value, index) => {
    const stringifiedVal = JSON.stringify(value);
    return (
      index ===
      array.findIndex((obj) => {
        return JSON.stringify(obj) === stringifiedVal;
      })
    );
  });
  return uniqueArray as T[];
};

export const debounce = <T>(
  callback: (...args: unknown[]) => T | Promise<T>,
  delay: number = 200
): ((...args: unknown[]) => Promise<T>) => {
  let timeoutId: NodeJS.Timeout;

  return async (...args: unknown[]) => {
    return new Promise<T>((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await callback(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

const getDateTimeInTwoDigitFormat = (dateTime: number): string => {
  if (dateTime <= 9) return `0${dateTime}`;
  return `${dateTime}`;
};

const getTimeInFormat = (time: Date): string => {
  const formatedTime = time.toTimeString().split(' ')[0].split(':');
  return `${getDateTimeInTwoDigitFormat(parseInt(formatedTime[0], 10))}:${formatedTime[1]}`;
};

export const formatDateTime = (dateTime: Date): string => {
  const year = dateTime.getFullYear();
  const month = getDateTimeInTwoDigitFormat(dateTime.getMonth() + 1);
  const day = getDateTimeInTwoDigitFormat(dateTime.getDate());

  const parsedTime = getTimeInFormat(dateTime);

  return `${year}-${month}-${day} ${parsedTime}`;
};

export const getErrorBoundaryExperienceModule = (entityType: EntityType): string => {
  switch (entityType) {
    case EntityType.Lead:
      return 'LeadDetails';
    case EntityType.Account:
      return 'AccountDetails';
    case EntityType.Opportunity:
      return 'OpportunityDetails';
    default:
      return 'EntityDetails';
  }
};

export const roundOffDecimal = (value: number): number => {
  try {
    return Math.round(value);
  } catch (error) {
    trackError(error);
  }
  return value;
};

const isDocumentHidden = (): boolean => {
  return document?.visibilityState === 'hidden';
};

export const hasAppVisibilityChanged = (): boolean => {
  return (self?.['app-visibility-changed'] || isDocumentHidden() || false) as boolean;
};

export const updateAppVisibilityState = (value: boolean): void => {
  window[APP_VISIBILITY_CHANGED] = value;
};

export const addCustomErrorProperty = (error: unknown, key: string, data: unknown): void => {
  try {
    if (error && typeof error === 'object') {
      Object?.assign(error, {
        [key]: data
      });
    }
  } catch (err) {
    trackError(err);
  }
};

export const sortDropdownOption = <T extends IOption>(options: T[]): T[] => {
  try {
    return options?.sort((firstItem, secondItem) => {
      const name1 = firstItem?.label?.toLowerCase();
      const name2 = secondItem?.label?.toLowerCase();
      if (name1 < name2) return -1;
      if (name1 > name2) return 1;
      return 0;
    });
  } catch (error) {
    trackError(error);
  }

  return options;
};

export const getHeader = (data: Record<string, string>): string => {
  if (data?.FirstName && data?.LastName) return `${data?.FirstName} ${data?.LastName}`;
  if (data?.FirstName) return data?.FirstName;
  return data?.EmailAddress || data?.Phone || data?.Mobile || '[No Name]';
};

export const safeParseInt = (string: string): number | undefined => {
  try {
    const numberFromString = parseInt(string);
    return numberFromString;
  } catch (error) {
    trackError('parsing to int failed', error);
  }
};

export const getEntityCode = (tabData: ITabConfig): string => {
  if (tabData) {
    return (tabData?.entityCode || '-1')?.replaceAll(OptionSeperator.MXSeparator, ',');
  }
  return '';
};

export const getAdvanceSearchText = (tabData: ITabConfig): string => {
  if (tabData) {
    return tabData?.gridConfig?.fetchCriteria?.AdvancedSearch;
  }
  return '';
};

export const getSearchText = (tabData: ITabConfig): string => {
  if (tabData) {
    return tabData?.gridConfig?.fetchCriteria?.SearchText;
  }
  return '';
};

export const getSortColumn = (tabData: ITabConfig): string => {
  if (tabData) {
    return tabData?.gridConfig?.fetchCriteria?.SortOn;
  }
  return '';
};

export const getSortOrder = (tabData: ITabConfig): number => {
  if (tabData) {
    return tabData?.gridConfig?.fetchCriteria?.SortBy;
  }
  return 0;
};

export const getLeadOnlyConditions = (tabData: ITabConfig): string => {
  if (tabData) {
    return tabData?.gridConfig?.fetchCriteria?.CustomFilters as string;
  }
  return '';
};

export const getTaskFilterOwner = (tabData: ITabConfig): string => {
  return (
    tabData?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName?.OwnerId?.value || ''
  );
};

export const getTaskFilterIncludeOverDue = (
  tabData: ITabConfig,
  includeOnlyOverDue = false
): boolean => {
  const filter = tabData?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName;
  if (includeOnlyOverDue) {
    if (filter?.status?.value?.includes('overdue')) {
      return !filter.status.value.includes(OptionSeperator.MXSeparator);
    }
  }
  return filter?.status?.value?.includes('overdue');
};

export const getTaskFilterDate = (tabData: ITabConfig, dateType: string): string | null => {
  const filter = tabData?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName;
  if (filter?.DueDate) {
    if (dateType === 'From_Date') {
      return (filter?.DueDate?.selectedValue as IDateOption)?.startDate || '';
    }
    return (filter?.DueDate?.selectedValue as IDateOption)?.endDate || '';
  }
  return null;
};

export const getTaskFilterStatus = (tabData: ITabConfig): string | null => {
  const filter = tabData?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName;

  if (filter?.status) {
    return filter?.status?.value;
  }
  return null;
};

export const getTaskTypeFilterValue = (tabData: ITabConfig): string => {
  return (
    tabData?.headerConfig?.secondary?.filterConfig?.filters?.bySchemaName?.TaskType?.value || ''
  );
};

export const handleActivityTableForAccount = async (
  code: number,
  response: IActivityDetails | null,
  callerSource: CallerSource
): Promise<IField[]> => {
  try {
    const activityMetadata = await getAccountActivityMetaData(
      code,
      CallerSource.AccountActivityHistory
    );
    const activityLookup = createHashMapFromArray(activityMetadata?.Fields || [], 'SchemaName');

    const promises = (response?.Fields as IField[])?.map(async (item: IField) => {
      const activityLookupData = activityLookup?.[item?.SchemaName];
      if (activityLookupData?.DataType === 'ActiveUsers') {
        const module = await import('common/component-lib/user-name/utils');
        const userDetails = await module.getUserNames([item?.Value], callerSource);
        return {
          ...item,
          ...activityLookupData,
          Value: (userDetails && userDetails[item?.Value]) || ''
        };
      }
      return {
        ...item,
        ...activityLookupData
      };
    });
    const updatedFields = await Promise.all(promises);
    return updatedFields;
  } catch (error) {
    trackError(error);
  }
  return [];
};

const getAdditionalAccountChangeLogFields = (
  response: IActivityFields | null
): IActivityFields[] => {
  return [
    {
      DataType: ActivityBaseAttributeDataType.String,
      DisplayName: 'Notes',
      Fields: [],
      IsMasked: false,
      SchemaName: DataType.ActivityEvent_Note,
      Value: (response?.ActivityNote || '') as string,
      DisplayValue: '',
      ShowInForm: true
    },
    {
      DataType: ActivityBaseAttributeDataType.String,
      DisplayName: 'Added By',
      Fields: [],
      IsMasked: false,
      SchemaName: DataType.String,
      Value: (response?.CreatedByName || '') as string,
      DisplayValue: '',
      ShowInForm: true
    },
    {
      DataType: ActivityBaseAttributeDataType.String,
      DisplayName: 'Created on',
      Fields: [],
      IsMasked: false,
      SchemaName: DataType.DateTime,
      Value: getFormattedDateTime({
        date: (response?.CreatedOn || '') as string,
        timeFormat: 'hh:mm a'
      }),
      DisplayValue: '',
      ShowInForm: true
    }
  ];
};

export const handleViewActivityForAccount = async (
  code: number,
  response: IActivityFields | null,
  callerSource: CallerSource
): Promise<IActivityFields[]> => {
  try {
    const activityMetadata = await getAccountActivityMetaData(
      code,
      CallerSource.AccountActivityHistory
    );
    const activityLookup = createHashMapFromArray(activityMetadata?.Fields || [], 'SchemaName');

    const accountActivityFields: IActivityFields[] = [];

    const promises = (response?.Fields as IActivityFields[])?.map(async (item: IActivityFields) => {
      const activityLookupData = activityLookup?.[item?.SchemaName];

      if (activityLookupData && activityLookupData?.ShowInForm) {
        if (activityLookupData?.DataType === 'ActiveUsers') {
          const module = await import('common/component-lib/user-name/utils');
          const userDetails = await module.getUserNames([item?.Value], callerSource);
          accountActivityFields.push({
            ...item,
            ...activityLookupData,
            Value: (userDetails && userDetails[item?.Value]) || ''
          });
        } else
          accountActivityFields.push({
            ...item,
            ...activityLookupData
          });
      }
    });
    await Promise.all(promises);
    return [...getAdditionalAccountChangeLogFields(response), ...accountActivityFields];
  } catch (error) {
    trackError(error);
  }
  return [];
};

export const showEllipsesAfter24Char = (text: string): string => {
  if (text && text?.length > 24) {
    return `${text?.substring(0, 24)}...`;
  }
  return text;
};

export const isSelectAll = (
  totalRecords: number,
  pageSize: number,
  selectedEntityLength: number
): boolean => {
  if (!totalRecords) return false;

  if (totalRecords >= pageSize) {
    return selectedEntityLength >= pageSize;
  }

  return selectedEntityLength >= totalRecords;
};

export const getDarkModeClass = (value: string): string => {
  if (getCurrentTheme() === AvailableTheme.Dark) {
    return `${value}_dark`;
  }
  return `${value}`;
};

export const isDarkMode = (): boolean => {
  return getCurrentTheme() === AvailableTheme.Dark;
};

export const openEntityDetailsPage = ({
  entityType,
  id,
  eventCode
}: {
  entityType: EntityType;
  id: string;
  eventCode?: string;
}): void => {
  try {
    if (isMiP()) {
      openEntityDetailsPagesInPlatform({
        entity: entityType,
        id: id,
        eventCode
      });
    } else {
      openEntityDetailsPagesInStandalone({
        entity: entityType,
        id: id,
        eventCode
      });
    }
  } catch (error) {
    trackError(error);
  }
};

export const getActiveTabIdFromUrl = (validTabIds: string[]): string | undefined => {
  try {
    const tabIdQueryParam = new URLSearchParams(location.search)?.get('activeTab');
    if (tabIdQueryParam) {
      if (validTabIds?.includes(tabIdQueryParam)) return tabIdQueryParam;
    }
  } catch (err) {
    trackError(err);
  }

  return undefined;
};

export const updateActiveTabIdInUrl = (newId: string): void => {
  try {
    const tabIdQueryParam = new URLSearchParams(location.search)?.get('activeTab');
    if (tabIdQueryParam) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('tabId', newId);
      window.history.pushState({}, '', newUrl);
    }
  } catch (err) {
    trackError(err);
  }
};

export const getLeadStageApiRoute = (leadType: string): string => {
  const mxSeperatedLeadType = (leadType || null)?.split(',').join(MXDATASEPERATOR);
  let apiRoute = API_ROUTES.leadDropdownOption;
  if (mxSeperatedLeadType?.length) {
    apiRoute = `${API_ROUTES.leadDropdownOption}?leadType=${mxSeperatedLeadType}`;
  }
  return apiRoute;
};

export const classNames = (...classes: ClassValue[]): string => {
  return classes
    ?.filter((className): className is string => typeof className === 'string')
    ?.join(' ');
};

export const getFullScreenVisitedLinks = (): Record<string, boolean> | undefined => {
  try {
    const storedValue = getItem<Record<string, boolean>>(StorageKey.FullScreenVisitedLinks);
    if (!storedValue) return undefined;
    return storedValue;
  } catch (error) {
    trackError(error);
    return undefined;
  }
};

export const setVisitedLink = (id: string): void => {
  if (!id) return;
  try {
    const storedValue = getFullScreenVisitedLinks();
    let visitedMap = {};

    if (storedValue) {
      visitedMap = storedValue;
    }

    visitedMap[id] = true;
    setItem(StorageKey.FullScreenVisitedLinks, JSON.stringify(visitedMap));
  } catch (error) {
    trackError(error);
  }
};

export const isVisitedLink = (id: string): boolean => {
  try {
    const storedValue = getFullScreenVisitedLinks();
    if (!storedValue) return false;
    return storedValue?.[id] || false;
  } catch (error) {
    trackError(error);
    return false;
  }
};

export const getIsStoreResetNeeded = (): boolean => {
  return window[ENTITY_STORE_RESET_KEY] as boolean;
};

export const setIsStoreResetNeeded = (value: boolean): void => {
  window[ENTITY_STORE_RESET_KEY] = value;
};

function isEqual<T extends object>(obj1: T, obj2: T): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    const val1 = obj1[key as keyof T];
    const val2 = obj2[key as keyof T];

    if (typeof val1 === 'object' && val1 !== null) {
      return typeof val2 === 'object' && val2 !== null && isEqual(val1, val2);
    }
    return val1 === val2;
  });
}

export function areArrayOfObjectsEqual<T extends object>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;

  return arr1.every((item, index) => isEqual(item, arr2[index]));
}
export const onThemeUpdateCallback = (selectedThemeConfig: {
  [x: string]: string | boolean;
}): void => {
  publishExternalAppEvent('lsq-marvin-theme-change', {
    data: {
      config: { ...(selectedThemeConfig || {}) }
    }
  });
};

export const getCurrentUserTimeZone = (): string => {
  const authConfig = getPersistedAuthConfig();
  return authConfig?.User?.TimeZone ?? '';
};

export const getListId = (): string | null => {
  try {
    const searchQuery = new URLSearchParams(window.location.search);
    const listId = searchQuery.get('listID');
    return listId;
  } catch (error) {
    trackError(error);
  }

  return null;
};

export const getListType = (): string | null => {
  try {
    const searchQuery = new URLSearchParams(window.location.search);
    const listType = searchQuery.get('listType');
    return listType;
  } catch (error) {
    trackError(error);
  }

  return null;
};
export function isValidJson(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}
