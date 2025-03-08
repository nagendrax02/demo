import { useEffect, useRef, useState } from 'react';
import NavigationBox from './components/navigation-box';
import TabItem from './components/tab-item';
import styles from './panel.module.css';
import useSmartViewStore from 'apps/smart-views/smartviews-store';
import { disableLeft, disableRight, getScrollLeft, getVisibleTabsLength } from './utils';
import { DEFAULT_TAB_WIDTH } from './constants';
import { SmartViewsEvents } from 'common/utils/experience/experience-modules';
import { endSVExpEvent, startSVExpEvent } from '../../utils/utils';

const TopPanel = (): JSX.Element => {
  const panelExp = useRef(
    ((): boolean => {
      startSVExpEvent(SmartViewsEvents.TabNavigationPanelRender, '');
      return true;
    })()
  );

  const allTabIds = useSmartViewStore((state) => state.allTabIds) || [];
  const rawTabDataMap = useSmartViewStore((state) => state.rawTabData);
  const activeTabId = useSmartViewStore((state) => state.activeTabId);
  const [scrollBy, setScrollBy] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [disableNav, setDisableNav] = useState({ right: false, left: false });
  const visibleTabsLength = useRef(0);

  const handleDisable = (offset: number = 0): void => {
    setDisableNav({
      left: disableLeft(scrollRef, offset),
      right: disableRight(scrollRef, allTabIds.length - visibleTabsLength.current, offset)
    });
  };

  const scrollToTab = (tabId: string): void => {
    const index = allTabIds.findIndex((id) => id === tabId);
    if (index !== -1) {
      // Below logic helps in calculating scroll length to show selected tab at right most visible point
      // toScroll > 0 indicates selected tab is one of starting tabs, so we scroll to left: 0
      const toScroll = Math.min(-DEFAULT_TAB_WIDTH * (index + 1 - visibleTabsLength.current), 0);
      const left = getScrollLeft(scrollRef);
      const offset = toScroll - left;
      handleDisable(offset);
      setScrollBy(toScroll);
    }
  };

  useEffect(() => {
    visibleTabsLength.current = getVisibleTabsLength(scrollRef);
    handleDisable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToTab(activeTabId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);

  const handleScroll = (offset: number): void => {
    handleDisable(offset);
    setScrollBy(scrollBy + offset);
  };

  useEffect(() => {
    if (allTabIds?.length && panelExp?.current) {
      panelExp.current = false;
      endSVExpEvent(SmartViewsEvents.TabNavigationPanelRender, '');
    }
  }, [allTabIds?.length]);

  return (
    <div className={styles.panel_top}>
      <div className={styles.tab_container}>
        <div className={styles.scroll_container} style={{ left: `${scrollBy}px` }} ref={scrollRef}>
          {allTabIds?.map((id) =>
            rawTabDataMap?.[id] ? (
              <TabItem
                key={id}
                tabData={rawTabDataMap?.[id]}
                onClick={scrollToTab}
                styleClass={`${styles.top_panel_tab_item} ${
                  id === activeTabId ? styles.top_panel_tab_item_active : ''
                }`}
              />
            ) : null
          )}
        </div>
      </div>
      <NavigationBox
        handleScroll={handleScroll}
        disableNav={disableNav}
        onTabSelect={scrollToTab}
      />
    </div>
  );
};

export default TopPanel;
