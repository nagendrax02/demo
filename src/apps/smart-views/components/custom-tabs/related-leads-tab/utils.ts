/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { TABS_CACHE_KEYS, commonTabData } from '../constants';
import { safeParseJson } from 'common/utils/helpers';
import {
  defaultEntityLeadsColumns,
  defaultEntityLeadsFilter,
  defaultEntityLeadsSortOn,
  entityTypeMap
} from './constants';
import {
  IEntityDetailsCoreData,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { RowHeightType, TabType } from 'apps/smart-views/constants/constants';
import { MASKED_TEXT } from 'common/constants';
import { ICacheConfig, fetchTabData } from '../utils';
import { CallerSource } from 'common/utils/rest-client';
import { IMarvinData } from '../../smartview-tab/smartview-tab.types';
import { EntityType } from 'common/types';
import { getAccountTypeId } from 'common/utils/helpers/helpers';
import { isLeadTypeEnabled } from 'common/utils/lead-type/settings';

// eslint-disable-next-line max-lines-per-function
export const getAdvanceSearchForEntityLeads = (config?: Record<string, string>): string =>
  JSON.stringify({
    GrpConOp: 'And',
    Conditions: [
      {
        Type: 'Company',
        ConOp: 'and',
        RowCondition: [
          {
            SubConOp: 'And',
            LSO: 'CompanyType',
            LSO_Type: 'CompanyType',
            Operator: 'eq',
            RSO:
              config?.CompanyType === MASKED_TEXT
                ? config?.CompanyType1
                : config?.CompanyType || getAccountTypeId()
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
            LSO_Type: 'String',
            Operator: 'eq',
            RSO: config?.CompanyId
              ? config?.CompanyId
              : config?.RelatedCompanyId === MASKED_TEXT
                ? config?.RelatedCompanyId1
                : config?.RelatedCompanyId,
            RSO_IsMailMerged: false
          }
        ]
      }
    ],
    QueryTimeZone: 'India Standard Time'
  });

const getTabTitle = (
  entityData: Record<string, string>,
  entityRepName?: IEntityRepresentationName
): string => {
  const { PluralName = 'Leads' } = entityRepName ?? {};
  const { RelatedCompanyIdName, CompanyTypeName, CompanyId } = entityData ?? {};

  if (RelatedCompanyIdName && CompanyTypeName) {
    return `Related ${PluralName} of ${RelatedCompanyIdName} (${CompanyTypeName})`;
  }
  if (CompanyId) {
    return 'Entity Leads Tab';
  }
  return `Related ${PluralName}`;
};

export const getEntityLeadsResponseData = async ({
  entityDetailsType,
  entityData,
  entityRepNames
}: IEntityDetailsCoreData & {
  entityData?: Record<string, string>;
}): Promise<ITabResponse> => {
  const relatedLeadsTitle = getTabTitle(entityData ?? {}, entityRepNames[EntityType.Lead]);
  const cacheKey =
    entityDetailsType === EntityType.Account
      ? TABS_CACHE_KEYS.LEADS_CACHE_KEY
      : TABS_CACHE_KEYS.RELATED_LEADS_CACHE_KEY;

  const [cachedDataResponse, isLeadTypeGloballyEnabled] = await Promise.all([
    fetchTabData(
      cacheKey,
      entityDetailsType === EntityType.Account
        ? CallerSource.AccountDetails
        : CallerSource.LeadDetails
    ),
    isLeadTypeEnabled(CallerSource.ManageLeads, true)
  ]);
  const cachedData = (cachedDataResponse as ICacheConfig) ?? {};
  const tabData = safeParseJson(JSON.stringify(commonTabData)) as ITabResponse;

  tabData.Id = entityTypeMap[entityDetailsType] as string;
  tabData.TabConfiguration.Title = relatedLeadsTitle;
  tabData.Type = TabType.Lead;

  const { FetchCriteria } = tabData.TabContentConfiguration;
  if (isLeadTypeGloballyEnabled && FetchCriteria) {
    const selectedColumns = FetchCriteria.SelectedColumns?.split(',') ?? [];
    if (!selectedColumns.includes('LeadType')) {
      selectedColumns.push('LeadType');
      FetchCriteria.SelectedColumns = selectedColumns.join(',');
    }
  }

  const additionalData: IMarvinData = {
    Marvin: {
      FilterValues: cachedData?.filters || {},
      Exists: true,
      AdvancedSearchText_English: '',
      Columns:
        cachedData?.selectedColumns ??
        cachedData?.defaultValues?.defaultColumns ??
        defaultEntityLeadsColumns.split(','),
      SearchText: cachedData.searchText,
      SearchSortedOn: cachedData?.sortedOn ?? defaultEntityLeadsSortOn,
      AdvancedSearchText: getAdvanceSearchForEntityLeads(entityData),
      tabColumnsWidth: cachedData?.tabWidthConfig,
      RowHeightSelected: RowHeightType.Default
    }
  };

  FetchCriteria.PageSize = String(cachedData?.pageSize ?? 25);

  FetchCriteria.SelectedFilters =
    cachedData?.selectedFilters?.join(',') ??
    cachedData?.defaultValues?.defaultFilters.join(',') ??
    defaultEntityLeadsFilter;
  FetchCriteria.AdditionalData = JSON.stringify(additionalData);

  tabData.TabContentConfiguration.FetchCriteria = { ...FetchCriteria };

  return {
    ...tabData
  };
};
