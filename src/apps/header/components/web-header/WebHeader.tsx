import useFetchNavItems from 'apps/header/use-fetch-nav-items';
import TopNavPanel from './top-nav-panel/TopNavPanel';
import CompanyLogo from '../company-logo';
import BottomNavPanel from './bottom-nav-panel/BottomNavPanel';
import styles from './web-header.module.css';
import { getNavItemBasedOnWorkArea } from './utils';
import { HEADER_STYLE } from 'apps/header/constants';
import WebHeaderShimmer from './WebHeaderShimmer';
import HeaderOverlay from '../header-overlay';

const WebHeader = (): JSX.Element => {
  const { isLoading, navItems } = useFetchNavItems();

  if (isLoading) return <WebHeaderShimmer />;

  const { topPanelItems, bottomPanelItems } = getNavItemBasedOnWorkArea(navItems);

  const getWebHeaderStyle = (): Record<string, string> => {
    return {
      ['--header-padding']: `${HEADER_STYLE.Padding}px`,
      ['--nav-items-gap']: `${HEADER_STYLE.IconGap}px`,
      ['--nav-icon-height']: `${HEADER_STYLE.IconHeight}px`
    };
  };

  return (
    <div className={styles.web_header} style={getWebHeaderStyle()}>
      <HeaderOverlay />
      <CompanyLogo />
      <TopNavPanel topPanelItems={topPanelItems} bottomPanelItems={bottomPanelItems} />
      <BottomNavPanel navItems={bottomPanelItems} />
    </div>
  );
};

export default WebHeader;
