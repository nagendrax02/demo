import { FEATURE_NAMES, HEADER_STYLE, WORK_AREA } from 'apps/header/constants';
import { INavItem } from 'apps/header/header.types';

const getNavItemBasedOnWorkArea = (
  navItems: INavItem[]
): { topPanelItems: INavItem[]; bottomPanelItems: INavItem[] } => {
  if (!navItems) {
    return { topPanelItems: [], bottomPanelItems: [] };
  }
  const topPanelItems: INavItem[] = [];
  const bottomPanelItems: INavItem[] = [];

  navItems.forEach((navItem) => {
    if (navItem.WorkArea === WORK_AREA.Bottom && bottomPanelItems.length <= 3) {
      bottomPanelItems.push(navItem);
    } else {
      topPanelItems.push(navItem);
    }
  });

  return { topPanelItems, bottomPanelItems };
};

const getSegmentedNavItems = (
  maxVisibleNavItems: number,
  navItems: INavItem[]
): { visibleNavItems: INavItem[]; overflowNavItems: INavItem[] } => {
  const visibleNavItems: INavItem[] = [];
  const overflowNavItems: INavItem[] = [];

  navItems?.forEach((item, index) => {
    if (index < maxVisibleNavItems) {
      visibleNavItems.push(item);
    } else {
      overflowNavItems.push(item);
    }
  });

  return { visibleNavItems, overflowNavItems };
};

const getNavHeight = (length: number): number => {
  if (!length) {
    return 0;
  }

  return length * (HEADER_STYLE.IconHeight + HEADER_STYLE.IconGap);
};

const getBottomNavFixedItemsCount = (restrictedApps: Record<string, boolean>): number => {
  // +3 is for fixed bottom nav items (help, quick add, profile)
  let items = 3;
  if (restrictedApps?.[FEATURE_NAMES.QUICK_ADD]) {
    items -= 1;
  }
  return items;
};

const generateSegmentedTopNavItems = (
  topNavItems: INavItem[],
  bottomNavItems: INavItem[],
  restrictedFeatures: Record<string, boolean>
): { visibleNavItems: INavItem[]; overflowNavItems: INavItem[] } => {
  const bodyHeight = document?.body?.getBoundingClientRect()?.height;
  const bottomNavHeight = getNavHeight(
    bottomNavItems?.length + getBottomNavFixedItemsCount(restrictedFeatures)
  );
  const padding = 2 * HEADER_STYLE.Padding; // padding of header
  const logoHeight = getNavHeight(1);
  const quickSearchHeight = restrictedFeatures[FEATURE_NAMES.GLOBAL_SEARCH] ? 0 : getNavHeight(1);

  const topNavPanelHeight = bodyHeight - padding - bottomNavHeight - logoHeight - quickSearchHeight;
  // maxVisibleNavItems = available height for top panel / height of one icon
  let maxVisibleNavItems = Math.floor(topNavPanelHeight / getNavHeight(1));

  if (topNavItems?.length && maxVisibleNavItems < topNavItems.length) {
    // subtracting by -1 because show more icon gets added
    maxVisibleNavItems -= 1;
  }
  return getSegmentedNavItems(maxVisibleNavItems, topNavItems);
};

export const getNavItemId = (navItem: INavItem): string => {
  return `lsq-marvin-left-header-nav-menu-${navItem?.DisplayConfig?.DisplayName?.toLowerCase()}-item`;
};

const addObserverToNavItem = (ref: React.RefObject<HTMLAnchorElement>): MutationObserver => {
  const handleMutations = (mutationsList: MutationRecord[]): void => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        // For externals apps that change display onload of script instead through onRender functionality
        if (ref?.current?.parentElement) {
          ref.current.parentElement.style.display = ref?.current?.style?.display;
        }
      }
    });
  };
  const observer = new MutationObserver(handleMutations);
  if (ref?.current) {
    observer.observe(ref.current, { attributes: true, attributeFilter: ['style'] });
  }
  return observer;
};

const isCarter = (name: string): boolean => {
  return name === 'carter-app-menu' || name === 'carter-app-widget';
};

export { getNavItemBasedOnWorkArea, generateSegmentedTopNavItems, addObserverToNavItem, isCarter };
