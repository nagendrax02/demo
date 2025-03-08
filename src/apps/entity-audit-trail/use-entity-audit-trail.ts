import { useEffect } from 'react';
import useAuditTrailStore from './entity-audit-trail.store';
import { IEntityDetailsCoreData } from '../entity-details/types/entity-data.types';
import { fetchAuditTrailRecords, initializeAuditTrail } from './utils/hook-utils';

interface IUseEntityAuditTrail {
  entityCoreData: IEntityDetailsCoreData;
}

// eslint-disable-next-line max-lines-per-function
const useEntityAuditTrail = (props: IUseEntityAuditTrail): void => {
  const { entityCoreData } = props;
  const {
    filters,
    fetchCriteria,
    setTypeFilterOptions,
    setIsFilterLoading,
    isFilterLoading,
    setIsGridLoading,
    setEntityCoreData,
    setDateFilterSelectedValue,
    setTypeFilterSelectedValue,
    setAugmentedAuditTrailData,
    setRawAuditTrailData,
    setFetchCriteria
  } = useAuditTrailStore();

  useEffect(() => {
    (async (): Promise<void> => {
      await initializeAuditTrail({
        setIsLoading: setIsFilterLoading,
        setTypeFilterOptions,
        entityCoreData,
        setEntityCoreData,
        setDateFilterSelectedValue,
        setTypeFilterSelectedValue
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFilterLoading && filters?.typeFilter?.filterOptions?.length) {
      (async (): Promise<void> => {
        await fetchAuditTrailRecords({
          fetchCriteria,
          setAugmentedAuditTrailData,
          setRawAuditTrailData,
          filters,
          entityCoreData,
          setIsGridLoading,
          setFetchCriteria
        });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isFilterLoading,
    fetchCriteria?.pageNumber,
    filters?.typeFilter?.selectedValue,
    fetchCriteria?.sortOrder,
    filters?.dateFilter?.selectedValue
  ]);
};

export default useEntityAuditTrail;
