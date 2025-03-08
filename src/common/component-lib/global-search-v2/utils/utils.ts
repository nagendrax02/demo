import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants';
import {
  EntityApiMap,
  EntityDetailsResult,
  IDefaultEntityConfig,
  IRecentSearchCardLayout,
  ISearchResult,
  GetActionsFunction,
  ISearchRecord
} from '../global-searchV2.types';
import { httpPost, CallerSource, Module } from 'common/utils/rest-client';
import { getProfileName, isMobileDevice, openLeadDetailTab } from 'common/utils/helpers/helpers';
import { ACTION } from 'apps/entity-details/constants';
import { setError, setResults } from '../global-searchV2.store';
import { EntityType } from 'common/types';
import { fetchData } from 'common/utils/entity-data-manager/lead/lead';
import { getActions } from 'apps/entity-details/utils/augment-entity-data/lead/vcard-action';
import {
  defaultResults,
  leadLayout,
  listLength,
  defaultConfigMap,
  MAX_RESULTS_TO_CACHE,
  ticketLayout,
  LEAD_TYPE_IS_PUBLISHED
} from '../constants';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import { removeItem, StorageKey } from 'common/utils/storage-manager';
import { ILeadTypeConfig } from 'common/utils/lead-type/lead-type.types';
import { IGlobalSearchEntityOptions } from '../components/global-search-filters/select-entity/SelectEntity';
import { ITicket } from 'v2/quick-view/augmentation/ticket/ticket.types';

export const getQuerySearchData = async (
  filters: { searchText: string; entityType: EntityType; leadType?: string },
  callerSource: CallerSource,
  pagination: { pageIndex: number; pageSize?: number } = { pageIndex: 1, pageSize: listLength }
): Promise<ISearchResult> => {
  try {
    const body = {
      SearchText: filters.searchText,
      PageIndex: pagination.pageIndex,
      PageSize: pagination.pageSize ?? listLength,
      LeadType: filters.leadType,
      EntityType: filters.entityType
    };

    const response: ISearchResult = await httpPost({
      path: API_ROUTES.GlobalSearch[filters.entityType] as string,
      module: Module.Marvin,
      body,
      callerSource
    });
    return response;
  } catch (error) {
    setError(true);
    setResults(defaultResults);
    trackError(error);
  }
  return defaultResults;
};

export const getName = (record: Record<string, string | null>): string => {
  return record?.FirstName || record?.LastName
    ? `${record?.FirstName ?? ''} ${record?.LastName ?? ''}`?.trim()
    : 'No Name';
};

export const getOverflowHandledName = (record: Record<string, string | null>): string => {
  const leadName = getName(record);
  if (leadName.length > 16 && (record?.EmailAddress || record?.Phone)) {
    return `${leadName.substring(0, 16)}...`;
  }
  return leadName;
};

export const truncateWithEllipses = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  return `${text.substring(0, limit)}...`;
};
export const getInitials = (record: Record<string, string | null>): string => {
  return getProfileName(getName(record));
};

export const entityApiMap: Partial<EntityApiMap> = {
  [EntityType.Lead]: fetchData
};

export const fetchEntityDetails = async <T extends keyof EntityApiMap>(
  entityType: EntityType,
  ...args: Parameters<EntityApiMap[T]>
): Promise<EntityDetailsResult> => {
  const apiFunction = entityApiMap[entityType] as EntityApiMap[T] | undefined;

  if (!apiFunction) {
    throw new Error(`No API function defined for entity type: ${entityType}`);
  }

  return apiFunction(...args);
};

export const mapEntityTypeToGetActions = <T>(entityType: EntityType): GetActionsFunction<T> => {
  if (entityType === EntityType.Lead) {
    return getActions as GetActionsFunction<T>;
  } else {
    throw new Error(`No getActions function defined for entity type: ${entityType}`);
  }
};

export function defaultAddEntityFormConfig(entityType: EntityType): IDefaultEntityConfig {
  return (
    defaultConfigMap[entityType] || {
      buttonText: 'Add Lead',
      modalTitle: 'Create New Lead',
      id: ACTION.AddNewLead
    }
  );
}

export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const isShortSearchWithNoCachedResults = (
  searchText: string,
  cachedCount: number
): boolean => {
  return searchText.length < 3 && cachedCount === 0;
};

export const isLongSearchWithNoResults = (searchText: string, resultsCount: number): boolean => {
  return searchText.length >= 3 && resultsCount === 0;
};

export const hasNoResultsOrCached = (resultsCount: number, cachedCount: number): boolean => {
  return resultsCount === 0 && cachedCount === 0;
};
export const shouldRenderNull = (
  searchText: string,
  counts: { cached: number; results: number }
): boolean => {
  return (
    isShortSearchWithNoCachedResults(searchText, counts.cached) ||
    isLongSearchWithNoResults(searchText, counts.results) ||
    hasNoResultsOrCached(counts.results, counts.cached)
  );
};

export const shouldRenderQuickViewNull = (
  searchText: string,
  counts: { cached: number; results: number }
): boolean => {
  return shouldRenderNull(searchText, counts);
};

export const shouldShowPlaceholder = (
  entityId: string | undefined,
  searchParameters: {
    error: boolean;
    searchText: string;
  },
  counts: { cached: number; results: number }
): boolean => {
  const { error, searchText } = searchParameters;
  if (searchText.length >= 3) {
    return !entityId && !error && counts.results > 0;
  }
  return !entityId && !error && (counts.results > 0 || counts.cached > 0);
};

export const getAccordianDeviceConfig: () => {
  defaultState: DefaultState;
  arrowRotate: { angle: ArrowRotateAngle; direction: ArrowRotateDirection };
} = () => {
  const isMobile = isMobileDevice();

  return {
    defaultState: isMobile ? DefaultState.CLOSE : DefaultState.OPEN,
    arrowRotate: {
      angle: isMobile ? ArrowRotateAngle.Deg90 : ArrowRotateAngle.Deg180,
      direction: ArrowRotateDirection.ClockWise
    }
  };
};

const mapValue: (attribute: string[] | string, valueMap: Record<string, unknown>) => string = (
  attribute: string[] | string,
  valueMap = {}
): string => {
  if (Array.isArray(attribute)) {
    return attribute?.map((attr) => (valueMap?.[attr] as string) || '').join(' ');
  }

  return (valueMap[attribute] as string) || '';
};

const createRedirectionHandler = (id: string) => (): void => {
  openLeadDetailTab(id, true);
};

export const mapLayoutValues = (
  layout: IRecentSearchCardLayout,
  data: Record<string, unknown>
): IRecentSearchCardLayout & { id: string } => {
  const id = mapValue(layout.uniqueIdentifier, data);

  const redirectionHandler = createRedirectionHandler(id);
  return {
    ...layout,
    heading: {
      ...layout.heading,
      iconTooltipText:
        mapValue(layout.heading.iconTooltipAttribute, data) || layout?.heading?.iconTooltipFallBack,
      value: mapValue(layout.heading.attribute, data)?.trim() || '[No Name]',
      tags: layout.heading.tags.map((tag) => ({
        ...tag,
        value: mapValue(tag.attribute, data)
      }))
    },
    description: layout.description.map((desc) => ({
      ...desc,
      value: mapValue(desc.attribute, data) || 'NA'
    })),
    ownerName: {
      ...layout.ownerName,
      value: mapValue(layout.ownerName.attribute, data)
    },
    id,
    redirectionHandler
  };
};

export const getLayoutForEntity = (entity: ISearchRecord): IRecentSearchCardLayout | null => {
  switch (entity.EntityType) {
    case EntityType.Lead:
      return leadLayout;
    case EntityType.Ticket:
      return ticketLayout(entity as ITicket);
    default:
      return null;
  }
};

export const updateCachedResults = (
  entity: {
    entityId: string;
    entityType: EntityType;
  },
  record: ISearchRecord,
  cachedResults: ISearchResult
): ISearchResult => {
  const { entityId, entityType } = entity;

  if (!entityType || !entityId) {
    return cachedResults;
  }

  const baseLayout: IRecentSearchCardLayout | null = getLayoutForEntity(record);

  if (!baseLayout) {
    return cachedResults;
  }

  const uniqueIdentifier = baseLayout.uniqueIdentifier;

  const updatedEntityRecords: ISearchRecord[] = [record, ...(cachedResults.Data || [])];

  const entityTypeRecords = updatedEntityRecords.filter(
    (item: ISearchRecord) => item.EntityType === entityType
  );
  const otherRecords = updatedEntityRecords.filter(
    (item: ISearchRecord) => item.EntityType !== entityType
  );

  const uniqueEntityTypeRecords: ISearchRecord[] = Array.from(
    new Map(
      entityTypeRecords.map((item: ISearchRecord) => {
        const uniqueValue = item[uniqueIdentifier];
        return [uniqueValue, item];
      })
    ).values()
  );

  const combinedRecords = [...uniqueEntityTypeRecords, ...otherRecords];

  const limitedRecords: ISearchRecord[] = combinedRecords.slice(0, MAX_RESULTS_TO_CACHE);

  return {
    ...cachedResults,
    TotalRecords: limitedRecords.length,
    Data: limitedRecords
  };
};

export const removeCacheItems = (keys: StorageKey[]): void => {
  keys.forEach((key) => {
    try {
      removeItem(key);
    } catch (error) {
      trackError(`Failed to remove item with key: ${key}`, error);
    }
  });
};
export const capitalizeWords = (text: string): string => {
  return text
    .split(/[-\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const convertLeadTypesToMap = (
  leadTypes: Record<string, ILeadTypeConfig> | null | undefined
): Record<string, IGlobalSearchEntityOptions> => {
  return Object.entries(leadTypes ?? {}).reduce((acc, [key, leadType]) => {
    const pluralName = leadType?.PluralName;
    const internalName = leadType?.InternalName;
    const isPublished = leadType?.Status === LEAD_TYPE_IS_PUBLISHED;

    if (isPublished) {
      acc[key] = {
        label: pluralName,
        value: internalName,
        entityType: EntityType.Lead,
        leadTypeInternalName: internalName
      };
    }

    return acc;
  }, {});
};
