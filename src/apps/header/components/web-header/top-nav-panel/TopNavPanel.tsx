import { useRef } from 'react';
import Search from 'apps/header/components/search';
import styles from 'apps/header/components/styles.module.css';
import NavItems from './nav-items';
import OverflowNavItems from './overflow-nav-items';
import { INavItem } from 'apps/header/header.types';
import { generateSegmentedTopNavItems } from '../utils';
import useHeaderStore from 'apps/header/header.store';

const TopNavPanel = ({
  topPanelItems,
  bottomPanelItems
}: {
  topPanelItems: INavItem[];
  bottomPanelItems: INavItem[];
}): JSX.Element => {
  const topNavPanelRef = useRef<HTMLDivElement>(null);
  const restrictedFeatures = useHeaderStore((state) => state.restrictedFeatures);

  const { visibleNavItems, overflowNavItems } = generateSegmentedTopNavItems(
    topPanelItems,
    bottomPanelItems,
    restrictedFeatures
  );

  return (
    <div className={`${styles.nav_panel} top-nav-panel`} ref={topNavPanelRef}>
      <NavItems navItems={visibleNavItems} />
      <Search />
      {overflowNavItems?.length ? <OverflowNavItems navItems={overflowNavItems} /> : null}
    </div>
  );
};

export default TopNavPanel;
