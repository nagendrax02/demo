import Icon from '@lsq/nextgen-preact/icon';
import styles from './tab-actions.module.css';
import useEntityTabsStore from '../store';
import { IMenuItem } from '../../action-wrapper/action-wrapper.types';
import { swapLastVisibleTabWithSelectedOverflowingTab } from '../utils/swap-tabs';
import ActionMenu from '@lsq/nextgen-preact/action-menu';
import { TabRecordTypeMap } from '../../tab-record-counter/constants';
import { getActionMenuItemWithCounter } from './utils';

const OverflownTabs = (): JSX.Element => {
  const { augmentedTabs, setActiveTabKey, setAugmentedTabs } = useEntityTabsStore();

  const handleMenuClick = (item?: IMenuItem): void => {
    if (!item || !augmentedTabs?.length) {
      return;
    }
    const selectedTab = augmentedTabs?.find((tab) => tab?.id === item?.value);
    setAugmentedTabs(
      swapLastVisibleTabWithSelectedOverflowingTab(augmentedTabs, selectedTab) || []
    );
    setActiveTabKey(item?.value);
  };

  const overflownTabs =
    augmentedTabs
      ?.filter((tab) => tab?.isOverflowing)
      .map((tab) => {
        return {
          value: tab?.id,
          label: tab?.name,
          clickHandler: handleMenuClick,
          customComponent: TabRecordTypeMap?.[tab?.id]
            ? getActionMenuItemWithCounter(tab)
            : undefined
        };
      }) || [];

  return (
    <>
      {overflownTabs?.length ? (
        <ActionMenu menuKey="overflowTabs" actions={overflownTabs}>
          <Icon
            name="more_horiz"
            customStyleClass={`${styles.color_secondary} ${styles.entity_details_more_tabs_action}`}
            dataTestId="overflown-tabs"
          />
        </ActionMenu>
      ) : null}
    </>
  );
};

export default OverflownTabs;
