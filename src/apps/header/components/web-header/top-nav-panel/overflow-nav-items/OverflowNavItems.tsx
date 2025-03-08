import { INavItem } from 'apps/header/header.types';
import ActionMenu from '@lsq/nextgen-preact/action-menu';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import Icon from '@lsq/nextgen-preact/icon';
import styles from '../../../styles.module.css';
import NavItem from '../nav-items/NavItem';
import useHeaderStore from 'apps/header/header.store';
import { getExternalAppHandler } from 'common/utils/helpers/external-app';

interface IOverflowNavItems {
  navItems: INavItem[];
}

const OverflowNavItems = ({ navItems }: IOverflowNavItems): JSX.Element => {
  const { activeNavItemName } = useHeaderStore((state) => ({
    activeNavItemName: state.activeNavItemName
  }));

  const getStyle = (navItem: INavItem): string => {
    // For apps which have their own icon being rendered
    if (
      navItem?.IsExternal &&
      typeof getExternalAppHandler(navItem?.Name)?.onRender === 'function'
    ) {
      return `${styles.overflow_nav_item} ${styles.overflow_nav_item_reverse} ${
        activeNavItemName === navItem.Name ? styles.active_overflow_nav_item : ''
      }`;
    }

    return `${styles.overflow_nav_item} ${
      activeNavItemName === navItem.Name ? styles.active_overflow_nav_item : ''
    }`;
  };

  const getAugmentedActions = (): IMenuItem[] => {
    return navItems.map((navItem) => {
      return {
        label: navItem.Name,
        value: `${navItem.Id}`,
        customComponent: (
          <NavItem
            navItem={navItem}
            showDisplayName
            customStyleClass={getStyle(navItem)}
            hideTooltip
          />
        )
      };
    });
  };

  return (
    <ActionMenu
      menuKey={'overflow-nav-items'}
      menuDimension={{ topOffset: 1 }}
      customStyleClass={styles.action_menu_style}
      renderOnLoad
      actions={getAugmentedActions()}>
      <div className={styles.nav_item}>
        <Icon customStyleClass={styles.icon_font_size} name="more_horiz" />
      </div>
    </ActionMenu>
  );
};

export default OverflowNavItems;
