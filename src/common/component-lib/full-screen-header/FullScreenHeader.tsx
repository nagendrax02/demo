import { useEffect, useState } from 'react';
import { getTabData } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import useSmartViewStore from 'apps/smart-views/smartviews-store';
import styles from './full-screen-header.module.css';
import {
  getPageIndex,
  getPageSize,
  getRecordIndex,
  getSelectedRecordIndex,
  handleClose,
  handleRecordDelete,
  retrieveBoundaryRecord,
  showNavigation
} from './utils';
import FullScreenHeaderAction from './FullScreenHeaderAction';
import { PositionItem } from './full-screen-header.types';
import useFullScreenDetails, {
  getFullScreenTitle,
  setFullScreenSelectedRecordId
} from './full-screen.store';
import { AvailableTheme, useTheme } from '@lsq/nextgen-preact/v2/stylesmanager';
import { setIsStoreResetNeeded } from 'common/utils/helpers/helpers';
import Icon from '@lsq/nextgen-preact/icon';

const FullScreenHeader = (): JSX.Element => {
  const { activeTabId } = useSmartViewStore();
  const tabData = getTabData(activeTabId);

  const { theme } = useTheme();

  const { selectedRecordId, records, type, deletedRecordId } = useFullScreenDetails();

  const pageSize = getPageSize(tabData);

  const gridConfigPageIndex = getPageIndex(tabData);

  // this index will be used when user navigate from one page to another page in full screen mode, which will pe passed to api call
  const [pageIndex, setPageIndex] = useState(gridConfigPageIndex);
  const [apiCallMade, setApiCallMade] = useState(false);

  const selectedRecordIndex = getSelectedRecordIndex({
    records,
    type,
    selectedRecordId
  });

  const [recordIndexCount, setRecordIndexCount] = useState(
    getRecordIndex(pageIndex, selectedRecordIndex, pageSize)
  );

  useEffect(() => {
    // below condition will be true when user is on second or greater page and opens first record in the full screen mode, and then press previous button
    if (records?.length - selectedRecordIndex === records?.length && pageIndex > 1) {
      const getUpdatedRecords = async (): Promise<void> => {
        retrieveBoundaryRecord({
          tabData,
          pageIndex: pageIndex - 1,
          activeTabId,
          positionItem: PositionItem.First,
          setApiCallMade,
          records
        });
      };

      getUpdatedRecords();
    } else if (records?.length - (selectedRecordIndex + 1) === 0 && !apiCallMade) {
      // this condition will be true when user opens last record in the full screen mode, and then press next button

      const getUpdatedRecords = async (): Promise<void> => {
        retrieveBoundaryRecord({
          tabData,
          pageIndex: pageIndex + 1,
          activeTabId,
          positionItem: PositionItem.Last,
          setApiCallMade,
          records
        });
      };
      getUpdatedRecords();
    }

    //page index will be changed when user crosses the item per page limit
    const selectedRecordRangeIndex = Math.ceil((selectedRecordIndex + 1) / pageSize);
    if (pageIndex !== selectedRecordRangeIndex) {
      setPageIndex(selectedRecordRangeIndex);
      setApiCallMade(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecordId]);

  const getDetailPageName = (): JSX.Element => {
    const fullScreenDetailPageRepName = getFullScreenTitle();
    if (fullScreenDetailPageRepName) {
      return (
        <>
          <div className={`${styles.tab_name_breadcrumb} ${styles.tab_name_color}`}>
            <Icon name="chevron_right" customStyleClass={styles.tab_name_icon} />
          </div>
          <span className={styles.name} title={fullScreenDetailPageRepName}>
            {fullScreenDetailPageRepName ? fullScreenDetailPageRepName : '[No Name]'}
          </span>
        </>
      );
    }
    return <></>;
  };

  useEffect(() => {
    if (deletedRecordId?.length) {
      handleRecordDelete({
        tabData,
        records,
        type,
        selectedRecordId,
        setFullScreenSelectedRecordId,
        setRecordIndexCount,
        pageIndex,
        activeTabId,
        apiCallMade,
        setApiCallMade
      });
      setIsStoreResetNeeded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedRecordId?.length]);

  return (
    <div
      className={`${styles.container} ${
        theme?.mode === AvailableTheme.Dark ? styles.dark : styles.light
      }`}>
      <div className={styles.tab_name}>
        <span className={styles.tab_name_color}>{tabData?.headerConfig?.primary?.title}</span>
        {getDetailPageName()}
      </div>
      <div className={styles.tab_action}>
        {showNavigation(type, tabData?.type) ? (
          <FullScreenHeaderAction
            recordIndexCount={recordIndexCount}
            tabData={tabData}
            pageIndex={pageIndex}
            setRecordIndexCount={setRecordIndexCount}
            apiCallMade={apiCallMade}
            setApiCallMade={setApiCallMade}
          />
        ) : null}
        <div className={`${styles.close} ${styles.action_button}`}>
          <Icon
            name="close"
            onClick={() => {
              handleClose(tabData, activeTabId);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FullScreenHeader;
