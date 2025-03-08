import React from 'react';
import styles from './full-screen-header.module.css';
import { ITabConfig } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import {
  getPageIndex,
  getPageSize,
  handleNext,
  handlePrev,
  isNextDisabled,
  isPreviousDisabled
} from './utils';
import useFullScreenDetails, { setFullScreenSelectedRecordId } from './full-screen.store';
import useSmartViewStore from 'apps/smart-views/smartviews-store';
import { AvailableTheme, useTheme } from '@lsq/nextgen-preact/v2/stylesmanager';
import { setIsStoreResetNeeded } from 'common/utils/helpers/helpers';
import Icon from '@lsq/nextgen-preact/icon';

interface IFullScreenHeaderAction {
  recordIndexCount: number;
  tabData: ITabConfig;
  pageIndex: number;
  setRecordIndexCount: (value: React.SetStateAction<number>) => void;
  apiCallMade: boolean;
  setApiCallMade: React.Dispatch<React.SetStateAction<boolean>>;
}

const FullScreenHeaderAction = (props: IFullScreenHeaderAction): JSX.Element => {
  const { recordIndexCount, tabData, pageIndex, setRecordIndexCount, apiCallMade, setApiCallMade } =
    props;

  const { activeTabId } = useSmartViewStore();

  const { theme } = useTheme();

  const { selectedRecordId, records, type, isFullScreenLoading } = useFullScreenDetails();

  const getDisabledStyle = (): string => {
    return theme?.mode === AvailableTheme.Dark ? styles.disabled_dark : styles.disabled_light;
  };

  return (
    <>
      <div className={styles.record_count}>
        {recordIndexCount} of {tabData?.recordCount}
      </div>
      <div
        className={`${styles.previous_container} ${styles.action_button} ${
          isPreviousDisabled({
            records,
            selectedRecordId,
            type,
            pageIndex
          })
            ? getDisabledStyle()
            : ''
        } ${isFullScreenLoading ? getDisabledStyle() : ''}`}
        onClick={() => {
          setIsStoreResetNeeded(true);
          handlePrev({
            setFullScreenSelectedRecordId,
            records,
            selectedRecordId,
            type,
            setRecordIndexCount
          });
        }}>
        <Icon name="chevron_left" />
        Previous
      </div>
      <div
        className={`${styles.next_container} ${styles.action_button} ${
          isNextDisabled({
            records,
            selectedRecordId,
            recordLength: tabData?.recordCount,
            type,
            pageIndex: getPageIndex(tabData),
            pageSize: getPageSize(tabData)
          })
            ? getDisabledStyle()
            : ''
        } ${isFullScreenLoading ? getDisabledStyle() : ''}`}
        onClick={() => {
          setIsStoreResetNeeded(true);
          handleNext({
            setFullScreenSelectedRecordId,
            records,
            selectedRecordId,
            type,
            tabData,
            pageIndex,
            activeTabId,
            apiCallMade,
            setApiCallMade,
            setRecordIndexCount
          });
        }}>
        Next <Icon name="chevron_right" />
      </div>
    </>
  );
};

export default FullScreenHeaderAction;
