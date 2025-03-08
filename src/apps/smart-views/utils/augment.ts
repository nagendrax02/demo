/* eslint-disable complexity */
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import {
  DefaultRepresentationName,
  SMARTVIEWS,
  TabType,
  panelSettings,
  SCHEMA_NAMES,
  SOCIAL_MEDIA_SCHEMA_NAMES,
  UserRoleMap,
  MAX_ALLOWED_TABS_DEFAULT,
  VALUE_SCHEMA_NAMES,
  USER_SCHEMA_NAMES,
  TASK_TYPE_CATEGORY,
  TASK_DATE_SCHEMA_NAME,
  DEFAULT_DATE_TIME
} from '../constants/constants';
import {
  ICommonTabSettings,
  IEntityTypeConfiguration,
  IPanel,
  IResponseFilterConfig,
  ISmartViews,
  ITabMetaDataResponse,
  ITabResponse
} from '../smartviews.types';
import { IRecordType, IColumn } from '../components/smartview-tab/smartview-tab.types';
import { getAugmentedFetchCriteria, getPanelOrientation } from './utils';
import { IEntityProperty, RenderType, DataType } from 'common/types/entity/lead/metadata.types';
import { EntityType, IAuthenticationConfig } from 'common/types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { isMiP } from 'common/utils/helpers';
import { isQuickFilterEnabled } from '../components/smartview-tab/components/header/search-filter/utils';
import { TABS_CACHE_KEYS } from '../components/custom-tabs/constants';
import { getActiveTabIdFromUrl } from 'common/utils/helpers/helpers';

export const replaceLeadWithRepName = (
  representationName: string | undefined,
  title: string
): string => {
  return title.replace(
    DefaultRepresentationName[TabType.Lead],
    representationName || DefaultRepresentationName[TabType.Lead]
  );
};

const getTabsToRender = (
  data: ITabMetaDataResponse,
  leadRepresentationName: IEntityRepresentationName | undefined
): {
  activeTabId: string;
  byTabId: Record<string, ITabResponse>;
  allTabIds: string[];
  manageTabIds: string[];
} => {
  let activeTabId = '';
  const allTabIds: string[] = [];
  const manageTabIds: string[] = [];
  const byTabId = {};

  data?.Tabs?.map((tab) => {
    if (tab?.TabConfiguration?.IsDefault) activeTabId = tab.Id;
    if (tab?.TabConfiguration?.Title && tab?.IsSystemTab) {
      tab.TabConfiguration.Title = replaceLeadWithRepName(
        leadRepresentationName?.PluralName,
        tab.TabConfiguration.Title
      );
    }
    tab.TabContentConfiguration.FetchCriteria = getAugmentedFetchCriteria(tab);
    if (isQuickFilterEnabled(tab.Id) || [TABS_CACHE_KEYS.MANAGE_TASKS_TAB].includes(tab.Id)) {
      manageTabIds.push(tab.Id);
    } else {
      allTabIds.push(tab.Id);
    }
    byTabId[tab.Id] = tab;
  });
  const activeTabIdFromUrl = getActiveTabIdFromUrl(data?.Tabs?.map((tab) => tab?.Id));
  if (activeTabIdFromUrl) activeTabId = activeTabIdFromUrl;

  if (!activeTabId) {
    activeTabId = data?.Tabs?.[0].Id;
  }
  return { activeTabId, byTabId, allTabIds, manageTabIds };
};

const getPanelConfig = (): IPanel => {
  return {
    title: SMARTVIEWS.defaultPanelTitle,
    orientation: getPanelOrientation(),
    panelSettings: panelSettings
  };
};

const getMaxFiltersAllowed = (filterConfig: IResponseFilterConfig): Record<EntityType, number> => {
  const maxAllowedFiltersMap = {};

  Object.keys(filterConfig ?? {})?.map((tabType) => {
    maxAllowedFiltersMap[tabType?.toLowerCase()] = (
      filterConfig?.[tabType] as IEntityTypeConfiguration
    )?.MaxAllowedFilters;
  });

  return maxAllowedFiltersMap as Record<EntityType, number>;
};

const getCommonTabSettings = (
  data: ITabMetaDataResponse,
  isLeadTypeEnabled: boolean,
  isLeadTypeEnabledGlobally: boolean
): ICommonTabSettings => {
  const {
    MaxAllowedTabs,
    IsCustomTabTypeEnabled,
    AutoRefreshConfiguration,
    FilterCustomizationConfiguration
  } = data.Configuration || {};
  const { User: currentUser } = (getItem(StorageKey.Auth) || {}) as IAuthenticationConfig;
  const userRole = isMiP() ? (UserRoleMap?.[currentUser?.Role] as string) : currentUser?.Role;

  const commonTabSettings = {
    maxAllowedTabs:
      MaxAllowedTabs?.[userRole] || MaxAllowedTabs?.Default || MAX_ALLOWED_TABS_DEFAULT,
    isCustomTabTypeEnabled: IsCustomTabTypeEnabled,
    showCount: data.ShowCount,
    autoRefreshConfiguration: {
      ActiveTabContentAutoRefreshInterval:
        AutoRefreshConfiguration.ActiveTabContentAutoRefreshInterval,
      TabAutoRefreshInterval: AutoRefreshConfiguration.TabAutoRefreshInterval
    },
    maxFiltersAllowed: getMaxFiltersAllowed(FilterCustomizationConfiguration),
    isLeadTypeEnabled,
    isLeadTypeEnabledGlobally
  };
  return commonTabSettings;
};

export const handleAugmentation = (config: {
  data: ITabMetaDataResponse;
  leadRepresentationName: IEntityRepresentationName | undefined;
  isLeadTypeEnabled: boolean;
  isLeadTypeEnabledGlobally: boolean;
}): ISmartViews => {
  const { data, leadRepresentationName, isLeadTypeEnabled, isLeadTypeEnabledGlobally } = config;

  const augmentedData: ISmartViews = {} as ISmartViews;
  augmentedData.smartViewId = data.Id;
  augmentedData.commonTabSettings = getCommonTabSettings(
    data,
    isLeadTypeEnabled,
    isLeadTypeEnabledGlobally
  );
  augmentedData.panel = getPanelConfig();
  const { byTabId, allTabIds, activeTabId, manageTabIds } = getTabsToRender(
    data,
    leadRepresentationName
  );
  augmentedData.allTabIds = allTabIds;
  augmentedData.manageTabsIds = manageTabIds;
  augmentedData.rawTabData = byTabId;
  augmentedData.activeTabId = activeTabId;
  if (leadRepresentationName) augmentedData.leadRepresentationName = leadRepresentationName;
  return augmentedData;
};

const applyAccountNameRenderType = (
  record: IRecordType,
  columnDef: IColumn,
  property: IEntityProperty
): IEntityProperty => {
  if (columnDef.id.endsWith(SCHEMA_NAMES.RELATED_COMPANY_ID)) {
    property.id = record[columnDef.id] || record[`P_${columnDef.id}`] || '';
    property.name =
      record[SCHEMA_NAMES.RELATED_COMPANY_ID_NAME] ||
      record[`P_${SCHEMA_NAMES.RELATED_COMPANY_ID_NAME}`] ||
      '';
    property.fieldRenderType = RenderType.AccountName;
  }
  return property;
};

const applyFileRenderType = (columnDef: IColumn, property: IEntityProperty): IEntityProperty => {
  if (columnDef.dataType === DataType.File) {
    property.fieldRenderType = RenderType.File;
  }
  return property;
};

const applyUserRenderType = ({
  columnDef,
  property,
  record,
  canHaveEmptyValuesForFieldName
}: {
  columnDef: IColumn;
  property: IEntityProperty;
  record: IRecordType;
  canHaveEmptyValuesForFieldName?: boolean;
}): IEntityProperty => {
  if (
    columnDef.dataType === DataType.ActiveUsers ||
    columnDef.id.endsWith(SCHEMA_NAMES.OWNER_ID_NAME) ||
    USER_SCHEMA_NAMES.includes(columnDef.id)
  ) {
    property.fieldRenderType = RenderType.UserName;
  }
  if (columnDef.id.endsWith(SCHEMA_NAMES.OWNER_ID_NAME)) {
    property.name = property.value;
  }
  if (property?.isCFSField) {
    property.name = '';
  }
  if (USER_SCHEMA_NAMES.includes(columnDef.id)) {
    const valueSchemaName = VALUE_SCHEMA_NAMES[columnDef.id];
    property.name = (record[valueSchemaName] as string) || '';
  }

  //TODO: need to update user cell renderer logic for all grid.
  if (canHaveEmptyValuesForFieldName) {
    property.name = '';
  }
  return property;
};

const applyCFSFieldProperties = (
  columnDef: IColumn,
  property: IEntityProperty
): IEntityProperty => {
  if (columnDef.id.includes('~')) {
    const [parentSchema, childSchema] = columnDef.id.split('~');
    property.isCFSField = true;
    property.schemaName = childSchema;
    property.parentSchemaName = parentSchema;
  }
  return property;
};

export const isTaskTypeTodo = (record: IRecordType, schemaName: string): boolean => {
  if (
    (record?.Category as unknown as number) === TASK_TYPE_CATEGORY.TODO &&
    TASK_DATE_SCHEMA_NAME.includes(schemaName)
  )
    return true;
  return false;
};

const applyDateTimeFormat = (
  columnDef: IColumn,
  property: IEntityProperty,
  record: IRecordType
): IEntityProperty => {
  if (
    columnDef.renderType === RenderType.Datetime ||
    columnDef.renderType === RenderType.DateTime ||
    property.fieldRenderType === RenderType.DateTime
  ) {
    property.timeFormat = 'hh:mm a';
    if (property.value === DEFAULT_DATE_TIME && columnDef.id === SCHEMA_NAMES.COMPLETED_ON) {
      property.value = '';
    }
  }
  if (isTaskTypeTodo(record, columnDef.id)) {
    const dateFormat =
      getPersistedAuthConfig()?.User?.DateFormat?.replace('mm', 'MM') || 'dd/MM/yyyy';
    property.dateTimeFormat = dateFormat;
  }
  return property;
};

const applySocialMediaDataType = (
  columnDef: IColumn,
  property: IEntityProperty
): IEntityProperty => {
  const schemaName = columnDef.id.replace('P_', '');
  if (SOCIAL_MEDIA_SCHEMA_NAMES.includes(schemaName)) {
    property.fieldRenderType = RenderType.SocialMedia;
    property.renderConfig = {
      renderLink: false
    };
    property.schemaName = schemaName;
  }
  return property;
};

const applyDateRenderType = (
  record: IRecordType,
  columnDef: IColumn,
  property: IEntityProperty
): IEntityProperty => {
  if (isTaskTypeTodo(record, columnDef.id)) {
    property.fieldRenderType = RenderType.DateWithTimezone;
  }
  return property;
};

const applyPhoneRenderType = (columnDef: IColumn, property: IEntityProperty): IEntityProperty => {
  if (columnDef.dataType === DataType.Phone) {
    property.fieldRenderType = RenderType.Phone;
  }
  return property;
};

const applyURLRenderType = (columnDef: IColumn, property: IEntityProperty): IEntityProperty => {
  if ([SCHEMA_NAMES.PHOTO_URL, `P_${SCHEMA_NAMES.PHOTO_URL}`].includes(columnDef.id)) {
    property.fieldRenderType = RenderType.URL;
  }
  return property;
};

const applyTimeZoneRenderType = (
  columnDef: IColumn,
  property: IEntityProperty
): IEntityProperty => {
  if (columnDef.id === `P_${SCHEMA_NAMES.TIMEZONE}`) {
    property.fieldRenderType = RenderType.TimeZone;
  }
  return property;
};

const applyDateTimeRenderType = (
  columnDef: IColumn,
  property: IEntityProperty
): IEntityProperty => {
  if ([SCHEMA_NAMES.DUE_DATE, SCHEMA_NAMES.END_DATE].includes(columnDef.id)) {
    property.fieldRenderType = RenderType.DateTime;
  }
  return property;
};

const updateValue = (property: IEntityProperty): IEntityProperty => {
  if (property.schemaName === `P_${SCHEMA_NAMES.REVENUE}`) {
    property.value = Number(property.value).toFixed(2);
  }
  return property;
};

const applyEssCheckOnDateRenderType = (property: IEntityProperty): IEntityProperty => {
  if (property?.fieldRenderType === RenderType.Date) {
    const isEssTenantEnabled =
      ((getItem(StorageKey.Setting) as Record<string, string | object>) || {})
        ?.EnableESSForLeadManagement === '1';
    if (isEssTenantEnabled) {
      property.ignoreSystemTimeValue = false;
    }
  }

  return property;
};

export const getAugmentedProperties = ({
  record,
  columnDef,
  canHaveEmptyValuesForFieldName = false
}: {
  record: IRecordType;
  columnDef: IColumn;
  rowHeight?: string;
  canHaveEmptyValuesForFieldName?: boolean;
}): IEntityProperty => {
  const property: IEntityProperty = {
    id: columnDef.id,
    name: columnDef.displayName,
    value: record[columnDef.id] || '',
    fieldRenderType: columnDef.renderType || RenderType.Text,
    schemaName: columnDef.id,
    dataType: columnDef.dataType || DataType.Text,
    entityId: columnDef?.isLeadFieldInNonLeadTab ? '' : record.Id || record?.id || '',
    isRenderedInGrid: true,
    isActivity: columnDef?.isActivity,
    customDisplayName: columnDef?.cfsDisplayName
  };

  applyAccountNameRenderType(record, columnDef, property);
  applyFileRenderType(columnDef, property);
  applyCFSFieldProperties(columnDef, property);
  applyUserRenderType({ columnDef, property, record, canHaveEmptyValuesForFieldName });
  applyDateTimeRenderType(columnDef, property);
  applyDateTimeFormat(columnDef, property, record);
  applySocialMediaDataType(columnDef, property);
  applyDateRenderType(record, columnDef, property);
  applyPhoneRenderType(columnDef, property);
  applyURLRenderType(columnDef, property);
  applyTimeZoneRenderType(columnDef, property);
  updateValue(property);
  applyEssCheckOnDateRenderType(property);

  return property;
};
