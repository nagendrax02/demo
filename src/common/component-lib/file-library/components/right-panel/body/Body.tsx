/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import useInfiniteScroll from 'common/utils/infinite-scroll';
import useFileLibraryStore from '../../../file-library.store';
import { IFileResponse } from '../../../file-library.types';
import { DEFAULT_PAGE_SIZE } from '../../../constants';
import { DEFAULT_SORT_OPTION } from '../../../default-sort-option';
import Grid from '../../grid';
import { getFilesFromAPI } from '../right-panel.service';
import TopSection from './TopSection';

const Body = (): JSX.Element => {
  const {
    selectedLibrary,
    searchText,
    sortFilter,
    setIsLoading,
    filesData,
    setFilesData,
    selectedFolder,
    refreshGridCount,
    setSearchText,
    setSortFilter,
    setSelectedFolder,
    callerSource
  } = useFileLibraryStore((state) => ({
    selectedLibrary: state.library.selected,
    searchText: state.searchText,
    sortFilter: state.sortFilter,
    setIsLoading: state.setIsLoading,
    filesData: state.filesData,
    setFilesData: state.setFilesData,
    selectedFolder: state.selectedFolder,
    refreshGridCount: state.refreshGridCount,
    setSearchText: state.setSearchText,
    setSortFilter: state.setSortFilter,
    setSelectedFolder: state.setSelectedFolder,
    callerSource: state.callerSource
  }));

  const fetchData = async (pageIndex?: number): Promise<IFileResponse | null> => {
    const response = await getFilesFromAPI({
      folderName: selectedFolder == 'root' ? '/' : selectedFolder,
      libraryType: selectedLibrary,
      searchText: searchText,
      sortBy: sortFilter.value,
      pageIndex: pageIndex || 1,
      callerSource
    });
    return response;
  };

  const loadFilesData = async (): Promise<void> => {
    setIsLoading(true);
    const response = await fetchData();

    if (response) {
      if (filesData?.Folders && filesData?.Folders.length > 0 && selectedFolder != '')
        response.Folders = filesData?.Folders;
      setFilesData(response);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setSearchText('');
    setSortFilter(DEFAULT_SORT_OPTION);
    setSelectedFolder('');
  }, [selectedLibrary]);

  useEffect(() => {
    if (selectedLibrary) {
      loadFilesData();
    }
  }, [selectedLibrary, searchText, sortFilter, selectedFolder, refreshGridCount]);

  const fetchNextPageData = async (pageIndex?: number): Promise<number> => {
    const response = await fetchData(pageIndex);
    if (response && filesData) {
      const newFilesData = { ...filesData, Files: filesData.Files.concat(response.Files) };
      setFilesData(newFilesData);
    }
    return response?.Files.length || 0;
  };

  const { isLoadingNextPage, intersectionRef } = useInfiniteScroll({
    fetchData: fetchNextPageData,
    paginationConfig: {
      hasMoreData: filesData?.Files.length === DEFAULT_PAGE_SIZE,
      resetPageIndex: searchText || sortFilter,
      pageSize: DEFAULT_PAGE_SIZE
    }
  });
  return (
    <>
      <TopSection />
      <Grid isLoadingNextPage={isLoadingNextPage} intersectionRef={intersectionRef} />
    </>
  );
};

export default Body;
