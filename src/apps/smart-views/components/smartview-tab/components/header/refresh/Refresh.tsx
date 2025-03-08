import { useState, useEffect } from 'react';
import Spinner from '@lsq/nextgen-preact/spinner';
import {
  useActiveTab,
  refreshGrid,
  useSmartViewPrimaryHeader,
  useIsGridUpdated,
  useRefreshConfig
} from '../../../smartview-tab.store';
import { startTimer, restartTimer } from './timer-helper';
import styles from './refresh.module.css';
import { isManageTab, logSVModuleUsage } from 'apps/smart-views/utils/utils';
import { SVUsageWorkArea } from 'common/utils/experience/experience-modules';
import { Reload } from 'assets/custom-icon/v2';
interface IRefresh {
  onRefreshComponent?: ({
    setIsCustomRefreshTriggered
  }: {
    setIsCustomRefreshTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  }) => JSX.Element;
}

const Refresh = ({ onRefreshComponent }: IRefresh): JSX.Element => {
  const [minutes, setMinutes] = useState(0);
  const [text, setText] = useState('just now');
  const [isEntityDataFetching, setIsEntityDataFetching] = useState(false);
  const [isCustomRefreshTriggered, setIsCustomRefreshTriggered] = useState(false);

  const activeTab = useActiveTab();

  const primaryHeader = useSmartViewPrimaryHeader(activeTab);

  const isGridUpdated = useIsGridUpdated();

  const refreshConfig = useRefreshConfig();

  useEffect(() => {
    setIsEntityDataFetching(!isGridUpdated);
    if (isGridUpdated) {
      restartTimer(setMinutes, minutes, setText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGridUpdated]);

  useEffect(() => {
    startTimer(setMinutes, minutes, setText);
  }, [minutes]);

  useEffect(() => {
    if (refreshConfig.restartTimer) restartTimer(setMinutes, minutes, setText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshConfig.restartTimer]);

  const onRefresh = (): void => {
    setIsEntityDataFetching(true);
    refreshGrid(activeTab);
    restartTimer(setMinutes, minutes, setText);
  };

  useEffect(() => {
    const timeInterval = primaryHeader?.autoRefreshTime;
    if (minutes >= timeInterval / 60 && !refreshConfig.skipAuto && !isManageTab(activeTab))
      onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes]);

  const handleRefreshClick = (): void => {
    onRefresh();
    if (onRefreshComponent) {
      setIsCustomRefreshTriggered(true);
    }
    logSVModuleUsage(activeTab, SVUsageWorkArea.Refresh);
  };

  const handleRefreshKeydown = (e: React.KeyboardEvent<HTMLSpanElement>): void => {
    if (e.key === 'Enter') {
      onRefresh();
      logSVModuleUsage(activeTab, SVUsageWorkArea.Refresh);
    }
  };

  return (
    <div className={styles.refresh_wrapper}>
      {isCustomRefreshTriggered && onRefreshComponent
        ? onRefreshComponent({ setIsCustomRefreshTriggered })
        : null}
      <div className={styles.refresh_tab}>
        <div className={styles.refresh_content_wrapper}>
          {isEntityDataFetching ? (
            <div className={styles.spinner_wrapper}>
              <Spinner />
            </div>
          ) : (
            <button
              tabIndex={0}
              onClick={handleRefreshClick}
              onKeyDown={handleRefreshKeydown}
              className={styles.refresh_button}>
              <Reload type="outline" className={styles.reload_icon} />
            </button>
          )}
          <span className={styles.refresh_info}>
            Refreshed <span className={styles.refresh_history}>{text}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Refresh;
