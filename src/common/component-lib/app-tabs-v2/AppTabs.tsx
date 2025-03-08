import { useEffect, useRef, useState } from 'react';
import useAppTabs from './use-app-tabs';
import useAppTabsStore, { setMoreTabsList } from './app-tabs.store';
import { ITabConfig } from './app-tabs.types';
import VisibleTabs from './components/visible-tabs';
import MoreTabs from './components/more-tabs';
import styles from './app-tabs.module.css';

const AppTabs = (): JSX.Element | null => {
  useAppTabs();

  const { appTabsConfig } = useAppTabsStore();

  const [visibleTabs, setVisibleTabs] = useState<ITabConfig[]>([]);
  const [moreTabs, setMoreTabs] = useState<ITabConfig[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = (): void => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.getBoundingClientRect()?.width;
        let totalWidth = 0;
        const visible: ITabConfig[] = [];
        const more: ITabConfig[] = [];
        const overflownTabsArray: string[] = [];

        for (const tab of appTabsConfig) {
          const tabWidth = 120;
          if (totalWidth + tabWidth < containerWidth) {
            visible.push(tab);
            totalWidth += tabWidth;
          } else {
            overflownTabsArray.push(tab?.id);
            more.push(tab);
          }
        }

        setMoreTabsList(overflownTabsArray);
        setVisibleTabs(visible);
        setMoreTabs(more);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [appTabsConfig]);

  return (
    <div className={styles.wrapper}>
      {visibleTabs?.length ? <div className={styles.divider} /> : null}
      <div ref={containerRef} className={styles.outer_container} data-testid="app-tabs-container">
        <div className={styles.inner_container}>
          <VisibleTabs config={visibleTabs} />
          <MoreTabs config={moreTabs} />
        </div>
      </div>
    </div>
  );
};

export default AppTabs;
