import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { fetchMetaData } from 'common/utils/entity-data-manager/lead/metadata';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { ILeadAttribute } from 'common/types/entity/lead';
import { EntityAttributeType } from 'common/types/entity/lead/metadata.types';
import { API_ROUTES } from 'common/constants';
import {
  IAuditTrailFetchCriteria,
  IAuditTrailFilters,
  IAuditTrailRawData
} from '../entity-audit-trail.types';

interface IGetRecordFetchApiBody {
  entityId: string;
  fetchCriteria: IAuditTrailFetchCriteria;
  filters: IAuditTrailFilters;
}

interface IFetchRecords {
  entityId: string;
  fetchCriteria: IAuditTrailFetchCriteria;
  filters: IAuditTrailFilters;
}

const getGroupedOptions = (options: ILeadAttribute[]): IOption[] => {
  const groupMap: Record<string, IOption[]> = options.reduce((acc, item) => {
    const group = item.EntityAttributeType ?? '';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push({ value: item.SchemaName, label: item.DisplayName });
    return acc;
  }, {});

  const groupedOptions: IOption[] = Object.keys(groupMap)
    .sort((a, b) => {
      if (a === EntityAttributeType.System) return -1;
      if (b === EntityAttributeType.System) return 1;
      return a.localeCompare(b);
    })
    .map((group) => ({
      label: group,
      value: group,
      subOptions: groupMap[group].toSorted((a, b) => a.label.localeCompare(b.label))
    }));

  return groupedOptions;
};

export const fetchTypeFilterOptions = async (): Promise<IOption[]> => {
  try {
    const leadMetaData = await fetchMetaData(CallerSource.EntityAuditTrail);
    const groupedOptions = getGroupedOptions(Object.values(leadMetaData));
    return groupedOptions;
  } catch (err) {
    trackError(err);
    return [];
  }
};

const getSelectedSchemaNames = (filterData: IAuditTrailFilters): string[] | null => {
  const allOptions = filterData?.typeFilter?.filterOptions?.flatMap((item) => item?.subOptions);
  if (filterData?.typeFilter?.selectedValue?.length) {
    if (filterData?.typeFilter?.selectedValue?.length === allOptions?.length) return null;
    return filterData?.typeFilter?.selectedValue?.map((opt) => opt?.value);
  }

  return null;
};

export const getRecordFetchApiBody = ({
  entityId,
  fetchCriteria,
  filters
}: IGetRecordFetchApiBody): Record<string, unknown> => {
  const allOptionSchemaArray = getSelectedSchemaNames(filters);
  const body = {
    EntityId: entityId,
    Fields: allOptionSchemaArray,
    CorrelationId: '',
    Paging: {
      Offset: fetchCriteria?.pageCountArray?.[fetchCriteria?.pageNumber] || 0
    },
    Sorting: {
      Direction: fetchCriteria?.sortOrder
    },
    From: filters?.dateFilter?.selectedValue?.startDate,
    To: filters?.dateFilter?.selectedValue?.endDate
  };
  return body;
};

export const fetchRecords = async ({
  entityId,
  fetchCriteria,
  filters
}: IFetchRecords): Promise<IAuditTrailRawData> => {
  const response: IAuditTrailRawData = await httpPost({
    path: API_ROUTES.LeadAuditLogGet,
    module: Module.Marvin,
    callerSource: CallerSource.EntityAuditTrail,
    body: getRecordFetchApiBody({ entityId, fetchCriteria, filters })
  });

  return response;
};
