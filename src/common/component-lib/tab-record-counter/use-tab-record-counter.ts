import { trackError } from 'common/utils/experience/utils/track-error';
import { RecordType, TabRecordTypeMap } from './constants';
import useTabRecordCounterStore from './tab-record-counter.store';
import { getRecordCount } from './utils.ts/fetch-data';
interface IUseTabRecordCounter {
  initializeTabRecordCount: (leadId: string) => Promise<void>;
  updateTabRecordCount: (leadId: string, recordType: RecordType) => Promise<void>;
}

const useTabRecordCounter = (): IUseTabRecordCounter => {
  const setTabRecordCountMap = useTabRecordCounterStore((state) => state?.setTabRecordCountMap);

  const updateTabRecordCount = async (leadId: string, recordType: RecordType): Promise<void> => {
    try {
      const updatedCount = await getRecordCount(recordType, leadId);
      setTabRecordCountMap({ [recordType]: updatedCount });
    } catch (err) {
      trackError(err);
    }
  };

  const initializeTabRecordCount = async (leadId: string): Promise<void> => {
    try {
      const filteredTabsPromises: Promise<void>[] = [];
      Object.values(TabRecordTypeMap).map((type) => {
        filteredTabsPromises?.push(updateTabRecordCount(leadId, type));
      });
      await Promise.all(filteredTabsPromises);
    } catch (err) {
      trackError(err);
    }
  };

  return {
    initializeTabRecordCount,
    updateTabRecordCount
  };
};

export default useTabRecordCounter;
