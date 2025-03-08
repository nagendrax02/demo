import Icon from '@lsq/nextgen-preact/icon';
import styles from './navigation.module.css';
import { DEFAULT_TAB_WIDTH } from '../../constants';
import { ActionWrapper } from 'common/component-lib/action-wrapper';
import useSmartViewStore from 'apps/smart-views/smartviews-store';
import { convertTabsToActionMenu } from './tab-to-action';

interface INavigationBox {
  handleScroll: (scrollBy: number) => void;
  disableNav: {
    right: boolean;
    left: boolean;
  };
  onTabSelect: (tabId: string) => void;
}

const NavigationBox = (props: INavigationBox): JSX.Element => {
  const { handleScroll, disableNav, onTabSelect } = props;
  const { allTabIds, rawTabData, activeTabId } = useSmartViewStore();

  const action = convertTabsToActionMenu({
    allTabIds,
    rawTabData,
    onTabSelect,
    activeTabId
  });

  return (
    <div className={styles.nav_box}>
      <Icon
        name="chevron_left"
        customStyleClass={`${styles.nav_button} ${disableNav.left ? styles.chevron_disable : ''}`}
        onClick={() => {
          handleScroll(DEFAULT_TAB_WIDTH);
        }}
      />
      <Icon
        name="chevron_right"
        customStyleClass={`${styles.nav_button} ${disableNav.right ? styles.chevron_disable : ''}`}
        onClick={() => {
          handleScroll(-DEFAULT_TAB_WIDTH);
        }}
      />
      <ActionWrapper
        action={action}
        menuKey={action.id || ''}
        id={action.id || ''}
        menuDimension={{ width: 260 }}
        customMenuStyleClass={styles.nav_menu}>
        <Icon name="more_horiz" customStyleClass={styles.nav_button} />
      </ActionWrapper>
    </div>
  );
};

export default NavigationBox;
