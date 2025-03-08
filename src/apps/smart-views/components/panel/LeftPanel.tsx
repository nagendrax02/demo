import useSmartViewStore from 'apps/smart-views/smartviews-store';
import TabItem from './components/tab-item';
import styles from './panel.module.css';
import ToggleButton from './components/toggle-button';
import { PanelState } from 'apps/smart-views/constants/constants';
import { useState } from 'react';
import Settings from './components/settings';
import { TabHeader } from './constants';

const LeftPanel = (): JSX.Element => {
  const { allTabIds, rawTabData, activeTabId, manageTabsIds } = useSmartViewStore();
  const [toggleState, setToggleState] = useState(PanelState.Open);

  const getTabList = (): JSX.Element => {
    return (
      <>
        {allTabIds?.map((id) =>
          rawTabData?.[id] ? (
            <TabItem
              key={id}
              tabData={rawTabData?.[id]}
              styleClass={`${styles.left_panel_tab_item} ${
                id === activeTabId ? styles.left_panel_tab_item_active : ''
              }`}
            />
          ) : null
        )}
      </>
    );
  };

  const getManageList = (): JSX.Element => {
    return (
      <>
        {manageTabsIds?.map((id) =>
          rawTabData?.[id] ? (
            <TabItem
              key={id}
              tabData={rawTabData?.[id]}
              styleClass={`${styles.left_panel_tab_item} ${
                id === activeTabId ? styles.left_panel_tab_item_active : ''
              }`}
            />
          ) : null
        )}
      </>
    );
  };

  const handleClick = (): void => {
    if (toggleState === PanelState.Open) {
      setToggleState(PanelState.Close);
    } else {
      setToggleState(PanelState.Open);
    }
  };

  return (
    <div className={styles.left_panel_wrapper}>
      <div
        className={`${styles.left_panel_container} ${
          toggleState === PanelState.Close ? styles.hide : styles.show
        }`}>
        <div className={styles.left_panel_content_wrapper}>
          <div className={styles.left_panel_header}>
            <span className="title">{TabHeader.SmartViews}</span>
            <Settings />
          </div>
          <div className={styles.tabs_list}>{getTabList()}</div>

          {manageTabsIds?.length ? (
            <>
              <div className={styles.left_panel_header}>
                <span className="title">{TabHeader.ManageTabs}</span>
              </div>
              <div className={styles.tabs_list}>{getManageList()}</div>
            </>
          ) : null}
        </div>
      </div>
      <ToggleButton toggleState={toggleState} onClick={handleClick} />
    </div>
  );
};

export default LeftPanel;
