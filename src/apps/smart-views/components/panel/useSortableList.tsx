import { useMemo, useRef } from 'react';
import { IManageTabsRef } from './components/manage-tabs/manage-tabs.types';
import { generateSortableList } from './components/manage-tabs/utils';
import { setSortableList } from './components/manage-tabs/manage-tabs.store';
import useSmartViewStore from '../../smartviews-store';

function useSortableList(): React.RefObject<IManageTabsRef> {
  const { allTabIds, rawTabData } = useSmartViewStore();

  const manageTabsRef = useRef<IManageTabsRef>({
    isListOrderChanged: false,
    currentDefaultTabId: '',
    deleteTabIds: [],
    removeCallback: () => {},
    currentRemoveTabName: ''
  });

  useMemo(() => {
    const sortableTabsList = generateSortableList(allTabIds, rawTabData, manageTabsRef);
    setSortableList(sortableTabsList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTabIds]);

  return manageTabsRef;
}

export default useSortableList;
