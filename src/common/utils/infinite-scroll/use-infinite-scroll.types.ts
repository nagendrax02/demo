interface IInfiniteScrollProps {
  fetchData: (pageNumber?: number) => Promise<number> | number;
  paginationConfig: {
    hasMoreData: boolean;
    resetPageIndex: unknown;
    scrollOffset?: number;
    pageSize?: number;
  };
}

interface IInfiniteScrollHook {
  isLoadingNextPage: boolean;
  intersectionRef: React.RefObject<HTMLDivElement>;
}

interface IGetNextPageData {
  setHasNextPage: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoadingNextPage: React.Dispatch<React.SetStateAction<boolean>>;
  fetchData: (pageNumber?: number) => Promise<number> | number;
  pageIndexRef: React.MutableRefObject<number>;
  pageSize: number;
}

export type { IInfiniteScrollProps, IInfiniteScrollHook, IGetNextPageData };
