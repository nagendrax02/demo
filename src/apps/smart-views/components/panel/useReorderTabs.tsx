import { useEffect } from 'react';
import useSmartViewStore, { getDefaultTabId, setAllTabIds } from '../../smartviews-store';
import { saveTabOrder } from './components/manage-tabs/utils';

function useReorderTabs(): void {
  const { allTabIds } = useSmartViewStore();

  useEffect(() => {
    const reorderTabs = async (): Promise<void> => {
      let tabIds: string[] = allTabIds;
      const defaultTabId: string = getDefaultTabId();
      if (allTabIds[0] !== defaultTabId) {
        tabIds = [defaultTabId, ...allTabIds.filter((tabId) => tabId !== defaultTabId)];
        setAllTabIds(tabIds);
        await saveTabOrder(tabIds);
      }
    };
    reorderTabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useReorderTabs;
