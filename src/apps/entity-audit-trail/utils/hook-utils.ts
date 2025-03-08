import { trackError } from 'common/utils/experience/utils/track-error';
import { IDateOption } from 'common/component-lib/date-filter';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import {
  getDateFilterSelectedValueFromCache,
  getTypeFilterSelectedValueFromCache
} from './cache-data';
import { fetchRecords, fetchTypeFilterOptions } from './fetch-data';
import {
  IAuditTrailAugmentedData,
  IAuditTrailFetchCriteria,
  IAuditTrailFilters,
  IAuditTrailRawData
} from '../entity-audit-trail.types';
import { getAugmentedAuditTrailData } from './augment-data';

interface IInitializeFilters {
  entityCoreData: IEntityDetailsCoreData;
  setDateFilterSelectedValue: (selectedValue: IDateOption) => void;
  setTypeFilterSelectedValue: (selectedValue: IOption[]) => void;
}

interface IInitializeAuditTrail {
  entityCoreData: IEntityDetailsCoreData;
  setTypeFilterOptions: (filterOptions: IOption[]) => void;
  setIsLoading: (state: boolean) => void;
  setEntityCoreData: (data: IEntityDetailsCoreData) => void;
  setDateFilterSelectedValue: (selectedValue: IDateOption) => void;
  setTypeFilterSelectedValue: (selectedValue: IOption[]) => void;
}

interface IFetchAuditTrailRecords {
  entityCoreData: IEntityDetailsCoreData;
  filters: IAuditTrailFilters;
  fetchCriteria: IAuditTrailFetchCriteria;
  setIsGridLoading: (state: boolean) => void;
  setRawAuditTrailData: (data: IAuditTrailRawData) => void;
  setAugmentedAuditTrailData: (data: Record<string, IAuditTrailAugmentedData[]>) => void;
  setFetchCriteria: (data: Partial<IAuditTrailFetchCriteria>) => void;
}

export const initializeFilters = async (props: IInitializeFilters): Promise<void> => {
  try {
    const { setTypeFilterSelectedValue, setDateFilterSelectedValue } = props;

    const typeFilterCache = await getTypeFilterSelectedValueFromCache();
    setTypeFilterSelectedValue(typeFilterCache ?? []);

    const dateFilterCache = await getDateFilterSelectedValueFromCache();
    if (dateFilterCache) setDateFilterSelectedValue(dateFilterCache);
  } catch (err) {
    trackError(err);
  }
};

export const initializeAuditTrail = async (props: IInitializeAuditTrail): Promise<void> => {
  const {
    setIsLoading,
    setTypeFilterOptions,
    entityCoreData,
    setEntityCoreData,
    setTypeFilterSelectedValue,
    setDateFilterSelectedValue
  } = props;
  try {
    setIsLoading(true);
    setEntityCoreData(entityCoreData);

    // fetch type filter options
    const promises = [fetchTypeFilterOptions()];
    const [typeFilterOptions] = await Promise.all(promises);
    setTypeFilterOptions(typeFilterOptions);

    // retain filter cache
    await initializeFilters({
      entityCoreData,
      setDateFilterSelectedValue,
      setTypeFilterSelectedValue
    });
  } catch (err) {
    trackError(err);
  }
  setIsLoading(false);
};

export const fetchAuditTrailRecords = async (props: IFetchAuditTrailRecords): Promise<void> => {
  const {
    setAugmentedAuditTrailData,
    setRawAuditTrailData,
    setIsGridLoading,
    entityCoreData,
    fetchCriteria,
    filters,
    setFetchCriteria
  } = props;
  try {
    setIsGridLoading(true);
    const entityId = entityCoreData?.entityIds?.[entityCoreData?.entityDetailsType];
    const response = await fetchRecords({ entityId, fetchCriteria, filters });
    setRawAuditTrailData(response);
    const augmentedResponse = getAugmentedAuditTrailData(response);
    setAugmentedAuditTrailData(augmentedResponse);
    const updatedPageCountArray = [...fetchCriteria.pageCountArray];
    updatedPageCountArray?.push(response?.FetchedLogsCount);

    setFetchCriteria({
      totalRecordCount: response?.TotalRecordCount,
      pageCountArray: updatedPageCountArray
    });
  } catch (err) {
    trackError(err);
  }
  setIsGridLoading(false);
};
