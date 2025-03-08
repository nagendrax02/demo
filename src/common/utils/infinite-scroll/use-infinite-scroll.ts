import { trackError } from 'common/utils/experience/utils/track-error';
/* istanbul ignore file */
import { useState, useEffect, useRef } from 'react';
import useIntersectionObserver from '../intersection-observer';
import {
  IInfiniteScrollProps,
  IInfiniteScrollHook,
  IGetNextPageData
} from './use-infinite-scroll.types';

const getNextPageData = async ({
  setHasNextPage,
  setIsLoadingNextPage,
  fetchData,
  pageIndexRef,
  pageSize
}: IGetNextPageData): Promise<void> => {
  try {
    setIsLoadingNextPage(true);
    const responseLength = (await fetchData(pageIndexRef.current)) as number;
    if (responseLength < pageSize) {
      setHasNextPage(false);
    }
    pageIndexRef.current += 1;
  } catch (error) {
    trackError('Error fetching next page data:', error);
  } finally {
    setIsLoadingNextPage(false);
  }
};

const useInfiniteScroll = (props: IInfiniteScrollProps): IInfiniteScrollHook => {
  const { fetchData, paginationConfig } = props;
  const { hasMoreData, resetPageIndex, pageSize = 25, scrollOffset = 100 } = paginationConfig;

  const pageIndexRef = useRef(2);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(hasMoreData as boolean);

  const { isInView, intersectionRef } = useIntersectionObserver({
    root: null,
    rootMargin: `${scrollOffset}px`
  });

  useEffect(() => {
    if (resetPageIndex) {
      pageIndexRef.current = 2;
    }
  }, [resetPageIndex]);

  useEffect(() => {
    if (hasMoreData) {
      setHasNextPage(true);
    }
  }, [hasMoreData]);

  useEffect(() => {
    if (isInView && !isLoadingNextPage && hasNextPage) {
      getNextPageData({
        setHasNextPage,
        setIsLoadingNextPage,
        fetchData,
        pageIndexRef,
        pageSize
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return { isLoadingNextPage, intersectionRef };
};

export default useInfiniteScroll;
