/* eslint-disable max-lines-per-function */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import useInfiniteScroll from 'common/utils/infinite-scroll';
import useActivityHistoryStore, { getCachedDateFilter } from './activity-history.store';
import {
  IActivityHistoryStore,
  IUseActivityHistory,
  IActivityHistoryDetail,
  IActivityHistoryHook
} from './types';
import { fetchData, fetchNextPageData, getAugmentedAHDetails } from './utils';
import { DEFAULT_PAGE_SIZE } from './constants';
import { TabType } from '../entity-details/types/entity-data.types';
import { getAugmentedResponse } from './augment-response';
import { EntityType } from 'common/types';
import { getTypeFilter } from './cache-utils';
import { getTabDetailId } from 'common/utils/helpers/helpers';
import { trackError } from 'common/utils/experience/utils/track-error';
import useRequest from 'common/utils/use-request';

const useActivityHistory = ({
  type,
  customTypeFilter,
  tabType,
  entityIds,
  eventCode
}: IUseActivityHistory): IActivityHistoryHook => {
  const {
    isLoading,
    setIsLoading,
    typeFilter,
    setTypeFilter,
    setDateFilter,
    dateFilter,
    augmentedAHDetails,
    setAugmentedAHDetails,
    accountLeadSelectedOption
  }: IActivityHistoryStore = useActivityHistoryStore();

  const isCustomActivityTab = tabType === TabType.CustomActivity || tabType === TabType.CustomTab;
  const isAccountLeadActivityHistoryTab = !!(
    entityIds.account && type === EntityType.Lead.toString()
  );
  const [isFilterUpdated, setIsFilterUpdated] = useState<boolean>(!!isCustomActivityTab);

  const isCustomActivityTabLoading = (): boolean => {
    return !!(isCustomActivityTab && !customTypeFilter);
  };

  function shouldRequestData(): boolean {
    if (isAccountLeadActivityHistoryTab && !accountLeadSelectedOption?.length) {
      return false;
    }

    if (
      !isFilterUpdated ||
      isCustomActivityTabLoading() ||
      !(entityIds?.lead || entityIds?.account)
    ) {
      return false;
    }

    return true;
  }

  const loadActivityHistoryData = async (signal: AbortSignal): Promise<void> => {
    setIsLoading(true);

    if (!shouldRequestData()) {
      setIsLoading(false);
      return;
    }

    let response: IActivityHistoryDetail[] | undefined;
    response = await fetchData({
      type,
      typeFilter,
      dateFilter,
      entityIds: entityIds,
      isActivityHistory: !isCustomActivityTab,
      eventCode: eventCode ? `${eventCode}` : undefined,
      accountLeadSelectedOption: accountLeadSelectedOption,
      signal
    });

    response = getAugmentedResponse(response);

    if (response) {
      setAugmentedAHDetails(await getAugmentedAHDetails(response, type, !isCustomActivityTab));
    } else setAugmentedAHDetails([]);

    setIsLoading(false);
  };

  useMemo(() => {
    if (isCustomActivityTab) {
      setTypeFilter(customTypeFilter || [], isAccountLeadActivityHistoryTab);
    }
  }, [customTypeFilter]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (!isCustomActivityTab) {
        try {
          const [filters, dateFilters] = await Promise.all([
            getTypeFilter({
              type,
              entityDetailId: getTabDetailId(),
              isAccountLeadActivityHistoryTab
            }),
            getCachedDateFilter(getTabDetailId(), type, isAccountLeadActivityHistoryTab)
          ]);

          setTypeFilter(filters || [], isAccountLeadActivityHistoryTab);
          if (dateFilters) setDateFilter(dateFilters);

          setIsFilterUpdated(true);
        } catch (error) {
          trackError(error);
        }
      }
    })();
  }, []);

  useRequest(loadActivityHistoryData, [
    typeFilter,
    dateFilter,
    accountLeadSelectedOption,
    isFilterUpdated
  ]);

  const fetchNextPageCount = async (pageNumber?: number): Promise<number> => {
    return fetchNextPageData({
      type,
      typeFilter,
      dateFilter,
      augmentedAHDetails,
      setAugmentedAHDetails,
      pageIndex: pageNumber,
      entityIds,
      eventCode,
      accountLeadSelectedOption: accountLeadSelectedOption
    });
  };

  const { isLoadingNextPage, intersectionRef } = useInfiniteScroll({
    fetchData: fetchNextPageCount,
    paginationConfig: {
      hasMoreData: augmentedAHDetails?.length === DEFAULT_PAGE_SIZE,
      resetPageIndex: !!(typeFilter.length || dateFilter)
    }
  });

  return {
    isLoading,
    isLoadingNextPage,
    intersectionRef,
    augmentedAHDetails
  };
};

export default useActivityHistory;
