import { useEffect, useState } from 'react';
import { IRecordType } from '../../smartview-tab.types';
import {
  setFullScreenRecords,
  useFullScreenDetails
} from 'common/component-lib/full-screen-header';
import FullScreenEntityDetails from '../../../full-screen-entity-details';
import { getFullScreenSelectedRecordId } from 'common/component-lib/full-screen-header/full-screen.store';
import { isSmartviewTab } from 'apps/smart-views/utils/utils';
import { skipAutoRefresh } from '../../smartview-tab.store';

interface IFullScreenRenderer {
  records: IRecordType[];
  activeTabId: string;
}

export const FullScreenRenderer = (props: IFullScreenRenderer): JSX.Element => {
  const { records, activeTabId } = props;

  const showFullScreen = useFullScreenDetails((state) => state.showFullScreen);

  const [showFullScreenModal, setShowFullScreenModal] = useState(false);

  const fullScreenRecord = useFullScreenDetails((state) => state.records);

  useEffect(() => {
    skipAutoRefresh(showFullScreen);
    // reason for the below check is that when we open any record in full screen mode and select any grid tab inside it, then it's records should not update the full screen records.
    if (isSmartviewTab(activeTabId) && !fullScreenRecord.length) {
      setShowFullScreenModal(showFullScreen);
      if (showFullScreen) {
        setFullScreenRecords(records);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFullScreen]);

  return (
    <>
      {showFullScreenModal && getFullScreenSelectedRecordId() ? <FullScreenEntityDetails /> : null}
    </>
  );
};
