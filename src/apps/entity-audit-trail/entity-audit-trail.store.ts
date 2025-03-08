import { create } from 'zustand';
import {
  IAuditTrailAugmentedData,
  IAuditTrailFetchCriteria,
  IAuditTrailRawData,
  IEntityAuditTrailStore,
  SortType
} from './entity-audit-trail.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IDateOption } from 'common/component-lib/date-filter';
import { EntityType } from 'common/types';
import { DEFAULT_ENTITY_IDS, DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { IEntityDetailsCoreData } from '../entity-details/types/entity-data.types';

const initialState = {
  entityCoreData: {
    entityDetailsType: EntityType.Lead,
    entityIds: DEFAULT_ENTITY_IDS,
    entityRepNames: DEFAULT_ENTITY_REP_NAMES
  },
  isFilterLoading: true,
  isGridLoading: false,
  filters: {
    typeFilter: {
      filterOptions: []
    },
    dateFilter: {}
  },
  rawAuditTrailData: {
    FetchedLogsCount: -1,
    TotalRecordCount: -1,
    Records: []
  },
  augmentedAuditTrailData: {},
  fetchCriteria: {
    pageCountArray: [0],
    sortOrder: SortType.Descend,
    totalRecordCount: 0,
    pageNumber: 0
  }
};

// eslint-disable-next-line max-lines-per-function
const useAuditTrailStore = create<IEntityAuditTrailStore>((set) => ({
  // state
  ...initialState,

  // setState
  setFetchCriteria: (data: Partial<IAuditTrailFetchCriteria>): void => {
    set((prevData) => {
      return {
        ...prevData,
        fetchCriteria: { ...prevData?.fetchCriteria, ...data }
      };
    });
  },
  setRawAuditTrailData: (data: IAuditTrailRawData): void => {
    set((prevData) => {
      return {
        ...prevData,
        rawAuditTrailData: data
      };
    });
  },
  setAugmentedAuditTrailData: (data: Record<string, IAuditTrailAugmentedData[]>): void => {
    set((prevData) => {
      return {
        ...prevData,
        augmentedAuditTrailData: data
      };
    });
  },
  setEntityCoreData: (state: IEntityDetailsCoreData): void => {
    set((prevData) => {
      return {
        ...prevData,
        entityCoreData: state
      };
    });
  },
  setIsFilterLoading: (state: boolean): void => {
    set((prevData) => {
      return {
        ...prevData,
        isFilterLoading: state
      };
    });
  },
  setIsGridLoading: (state: boolean): void => {
    set((prevData) => {
      return {
        ...prevData,
        isGridLoading: state
      };
    });
  },
  setTypeFilterSelectedValue: (selectedValue: IOption[]): void => {
    set((prevData) => {
      return {
        ...prevData,
        filters: {
          ...prevData.filters,
          typeFilter: {
            ...prevData.filters.typeFilter,
            selectedValue: selectedValue
          }
        }
      };
    });
  },
  setTypeFilterOptions: (filterOptions: IOption[]): void => {
    set((prevData) => {
      return {
        ...prevData,
        filters: {
          ...prevData.filters,
          typeFilter: {
            ...prevData.filters.typeFilter,
            filterOptions: filterOptions
          }
        }
      };
    });
  },
  setDateFilterSelectedValue: (selectedValue: IDateOption): void => {
    set((prevData) => {
      return {
        ...prevData,
        filters: {
          ...prevData.filters,
          dateFilter: {
            ...prevData.filters.dateFilter,
            selectedValue: selectedValue
          }
        }
      };
    });
  },

  // reset all states to initial values
  resetAuditTrailStore: (): void => {
    set({ ...initialState });
  }
}));

export default useAuditTrailStore;
