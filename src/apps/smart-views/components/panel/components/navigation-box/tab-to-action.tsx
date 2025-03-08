import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import TabItem from '../tab-item';
import styles from './navigation.module.css';
import Settings from '../settings';

export const convertTabsToActionMenu = (config: {
  allTabIds: string[];
  rawTabData: Record<string, ITabResponse>;
  onTabSelect: (tabId: string) => void;
  activeTabId: string;
}): IActionWrapperItem => {
  const { allTabIds, rawTabData, onTabSelect, activeTabId } = config;

  const subMenu: IMenuItem[] = [];
  allTabIds?.map((id) => {
    const tabData = rawTabData?.[id];
    subMenu.push({
      label: tabData.TabConfiguration.Title,
      value: tabData.Id,
      customComponent: (
        <TabItem
          tabData={tabData}
          onClick={onTabSelect}
          styleClass={`${styles.nav_box_tab_item} ${
            activeTabId === id ? styles.nav_box_tab_item_active : ''
          }`}
        />
      )
    });
  });

  subMenu.push({
    label: '',
    value: 'panel_settings',
    customComponent: <Settings />
  });

  return { id: 'tab-navigation', subMenu };
};
