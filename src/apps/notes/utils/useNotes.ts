import { useEffect } from 'react';
import useNotesStore from '../notes.store';
import { INotesItem } from '../notes.types';
import useInfiniteScroll from 'common/utils/infinite-scroll';
import { fetchNextPage, fetchNotes } from './notes';
import { DEFAULT_PAGE_SIZE, alertConfig } from '../constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { IEntityIds } from '../../entity-details/types/entity-store.types';

interface IUseNotes {
  isLoading: boolean;
  isLoadingNextPage: boolean;
  notes: INotesItem[];
  intersectionRef: React.RefObject<HTMLDivElement>;
}

const useNotes = (config: { entityIds: IEntityIds }): IUseNotes => {
  const { entityIds } = config;
  const { isLoading, notesList, page, date, refreshKey, setNotesList, setIsLoading } =
    useNotesStore();
  const { showAlert } = useNotification();
  const { startDate, endDate } = date;

  const fetchNextPageCount = async (pageNumber?: number): Promise<number> => {
    return fetchNextPage({ pageNumber, setNotesList, notesList, startDate, endDate, entityIds });
  };

  const { isLoadingNextPage, intersectionRef } = useInfiniteScroll({
    fetchData: fetchNextPageCount,
    paginationConfig: {
      hasMoreData: notesList?.length === DEFAULT_PAGE_SIZE,
      resetPageIndex: `${refreshKey}`
    }
  });

  useEffect(() => {
    (async (): Promise<void> => {
      if (!refreshKey) {
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetchNotes({ page, entityIds, startDate, endDate });
        setNotesList(response.List);
      } catch (error) {
        console.log(error);
        showAlert(alertConfig.GENERIC);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return {
    isLoading,
    isLoadingNextPage,
    notes: notesList,
    intersectionRef
  };
};

export default useNotes;
