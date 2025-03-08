import { useEffect } from 'react';
import useTasksStore from '../tasks.store';
import { ITaskItem } from '../tasks.types';
import { fetchNextPage, fetchTasks } from './tasks';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { DEFAULT_PAGE_SIZE, alertConfig } from '../constants';
import useInfiniteScroll from 'common/utils/infinite-scroll';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';

interface IUseTasks {
  isLoading: boolean;
  tasksList: ITaskItem[];
  totalTasks: number;
  intersectionRef: React.RefObject<HTMLDivElement>;
  isLoadingNextPage: boolean;
}

const useTasks = ({ entityIds }: { entityIds: IEntityIds }): IUseTasks => {
  const {
    isLoading,
    tasksList,
    setTasksList,
    totalTasks,
    setIsLoading,
    refreshKey,
    date,
    statusCode
  } = useTasksStore();
  const { showAlert } = useNotification();

  const fetchNextPageCount = async (pageNumber?: number): Promise<number> => {
    return fetchNextPage({
      pageNumber,
      setTasksList,
      currentTasks: tasksList,
      date,
      leadId: entityIds?.lead,
      statusCode,
      showAlert,
      opportunityId: entityIds?.opportunity
    });
  };

  const { isLoadingNextPage, intersectionRef } = useInfiniteScroll({
    fetchData: fetchNextPageCount,
    paginationConfig: {
      hasMoreData: tasksList?.length === DEFAULT_PAGE_SIZE,
      resetPageIndex: `${refreshKey}`
    }
  });

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (!refreshKey) return;

        setIsLoading(true);
        const response = await fetchTasks({
          statusCode,
          date,
          leadId: entityIds?.lead,
          page: 1,
          opportunityId: entityIds?.opportunity
        });
        setTasksList(response);
      } catch (error) {
        console.log(error);
        showAlert(alertConfig.GENERIC);
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return {
    isLoading,
    tasksList,
    totalTasks,
    intersectionRef,
    isLoadingNextPage
  };
};

export default useTasks;
