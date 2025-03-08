import styles from './more-tabs.module.css';
import ActionMenu from '@lsq/nextgen-preact/action-menu';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { ITabConfig } from '../../app-tabs.types';
import Tab from '../tab';
import { MORE_TAB_WIDTH } from '../../constants';
import useAppTabsStore from '../../app-tabs.store';
import { getAppTabCount } from '../../utils/render-utils';
import { getMaxTabLimit } from '../../utils/hook-utils';
import { Option } from 'assets/custom-icon/v2';

interface IMoreTabsProps {
  config: ITabConfig[];
}

const MoreTabs = ({ config }: IMoreTabsProps): JSX.Element | null => {
  const { appTabsConfig } = useAppTabsStore();

  const getActions = (): IMenuItem[] => {
    return config?.map((item) => {
      return {
        label: item?.title,
        value: item?.id,
        customComponent: <Tab config={item} tabWidth={MORE_TAB_WIDTH} isMoreTab key={item?.id} />
      };
    });
  };

  const getMoreTabDropdownHeader = (): JSX.Element => {
    const message = `${getAppTabCount(appTabsConfig)}/${getMaxTabLimit()} Tabs Added`;
    return (
      <div className={styles.action_menu_dropdown_header}>
        <div>{message}</div>
      </div>
    );
  };

  if (!config?.length) {
    return null;
  }

  return (
    <div className={styles.action_menu_wrapper} data-testid="more-tabs-wrapper">
      <ActionMenu
        menuKey="app-tabs-more-tab"
        actions={getActions()}
        customStyleClass={styles.action_menu_dropdown}
        customMenuHeader={getMoreTabDropdownHeader()}>
        <div className={styles.dropdown_icon_wrapper} data-testid="more-tabs-icon">
          <Option type="outline" />
        </div>
      </ActionMenu>
    </div>
  );
};

export default MoreTabs;
