import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { httpPost, CallerSource, Module } from 'common/utils/rest-client';
import { EntityType } from 'common/types';
import { API_ROUTES } from 'common/constants';
import { IActivityHistoryDetail } from '../types';
import { IActivityCategoryMetadata } from '../types/category-metadata.types';
import { IEventFilters, getActivityEventCodes, getEventFilter } from './event-filter';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IDateOption } from 'common/component-lib/date-filter/date-filter.types';
import {
  setCategoryMetadataCache,
  getCategoryMetadataCache
} from './activity-category-metadata/cache-category-metadata';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import {
  ExperienceType,
  endExperienceEvent,
  getExperienceKey,
  startExperienceEvent
} from 'common/utils/experience';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';

import { IEntityBody } from '../types/activity-history.types';
import { ISelectedLeadFilterOption } from '../components/filters/account-lead-filter/accountLeadFilter.types';
import { EntityDetailsEvents } from 'common/utils/experience';

interface IFetchData {
  type: EntityType;
  typeFilter: IOption[];
  dateFilter: IDateOption | undefined;
  entityIds: IEntityIds;
  isActivityHistory?: boolean;
  pageIndex?: number;
  eventCode?: string;
  accountLeadSelectedOption?: ISelectedLeadFilterOption[];
  signal?: AbortSignal;
}

interface IGetEntityBody {
  dateFilter: IDateOption | undefined;
  pageIndex: number;
  eventFilter: IEventFilters[];
  categoryMetadata: IActivityCategoryMetadata[] | undefined;
  typeFilter: IOption[];
  type: EntityType;
  accountLeadSelectedOption: ISelectedLeadFilterOption[] | undefined;
  entityIds: IEntityIds;
  eventCode: string | undefined;
}

export const entitySourceMap: Record<string, string> = {
  [EntityType.Lead]: 'LeadDetails',
  [EntityType.Opportunity]: 'OpportunityDetails'
};

export const entityApiPathMap: Record<string, string> = {
  [EntityType.Lead]: API_ROUTES.activityHistory,
  [EntityType.Opportunity]: API_ROUTES.activityHistory,
  [EntityType.Account]: API_ROUTES.accountActivityHistory
};

export const getBody = (entityType: EntityType): Record<string, string | number | null> => {
  return {
    Source: entitySourceMap?.[entityType] || 'LeadDetails',
    PageSize: getItem(StorageKey.AhDefaultPageSize) || 25,
    ActivityId: null
  };
};

const getEntityBody = async (props: IGetEntityBody): Promise<IEntityBody> => {
  const {
    dateFilter,
    pageIndex,
    eventFilter,
    categoryMetadata,
    typeFilter,
    type,
    accountLeadSelectedOption,
    entityIds,
    eventCode
  } = props;

  let leadId: string;

  if (entityIds?.account && type === EntityType.Lead && accountLeadSelectedOption?.length) {
    leadId = accountLeadSelectedOption?.[0]?.value;
  } else {
    leadId = entityIds?.lead || '';
  }
  if (type === EntityType.Account) {
    const activityEventFilter = getActivityEventCodes(typeFilter);
    const returnData = {
      Query: {
        RelatedCompanyId: entityIds?.account,
        RelatedCompanyTypeId: entityIds?.EntityTypeId || '',
        RelatedCompanyTypeName: '',
        TabId: 'accountActivityHistory',
        ActivityEventCodes: activityEventFilter,
        DateRange: {
          DateField: 'ActivityDate',
          FromDate: dateFilter?.startDate || null,
          ToDate: dateFilter?.endDate || null
        }
      },
      Paging: {
        PageIndex: pageIndex,
        PageSize: getItem(StorageKey.AhDefaultPageSize) || 25
      }
    };
    return returnData;
  }
  return {
    ...getBody(type),
    Id: leadId,
    PageIndex: pageIndex,
    EventFilter: eventFilter,
    From: dateFilter?.startDate || null,
    To: dateFilter?.endDate || null,
    CanGetMetadata: !categoryMetadata || categoryMetadata?.length === 0,
    ActivityId: entityIds?.opportunity || null,
    ActivityEvent: eventCode || null
  };
};

// eslint-disable-next-line max-lines-per-function, complexity
export const fetchData = async ({
  type,
  typeFilter,
  dateFilter,
  entityIds,
  isActivityHistory,
  pageIndex = 1,
  eventCode,
  accountLeadSelectedOption,
  signal
}: IFetchData): Promise<IActivityHistoryDetail[] | undefined> => {
  const experienceConfig = getExperienceKey();
  if (isActivityHistory) {
    startExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.ActivityHistoryApi,
      key: experienceConfig.key
    });
  }
  try {
    const eventFilter = await getEventFilter(typeFilter, type, eventCode);
    const categoryMetadata = getCategoryMetadataCache(type);

    const response = (await httpPost({
      path: entityApiPathMap?.[type],
      module: Module.Marvin,
      body: await getEntityBody({
        dateFilter,
        pageIndex,
        eventFilter,
        categoryMetadata,
        typeFilter,
        type,
        accountLeadSelectedOption,
        entityIds,
        eventCode
      }),
      callerSource: CallerSource.ActivityHistory,
      requestConfig: { signal }
    })) as {
      ActivityHistory: IActivityHistoryDetail[];
      ActivityCategoryMetadata?: IActivityCategoryMetadata[];
    };
    if (response.ActivityCategoryMetadata) {
      const sortedData =
        type === EntityType.Lead
          ? (response?.ActivityCategoryMetadata?.sort((a, b) =>
              (a.Text || '').toLowerCase() > (b.Text || '').toLowerCase() ? 1 : -1
            ) as IActivityCategoryMetadata[])
          : response?.ActivityCategoryMetadata;
      setCategoryMetadataCache(sortedData, type);
    }
    if (isActivityHistory) {
      endExperienceEvent({
        module: experienceConfig.module,
        experience: ExperienceType.Load,
        event: EntityDetailsEvents.ActivityHistoryApi,
        key: experienceConfig.key
      });
    }
    return response.ActivityHistory;
  } catch (error) {
    if (isActivityHistory) {
      endExperienceEvent({
        module: experienceConfig.module,
        experience: ExperienceType.Load,
        event: EntityDetailsEvents.ActivityHistoryApi,
        key: experienceConfig.key,
        hasException: true
      });
    }
    trackError('Error fetching data:', error);
  }
};
