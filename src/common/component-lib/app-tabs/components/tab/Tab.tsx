import { Theme } from 'common/types';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { ITabConfig } from '../../app-tabs.types';
import styles from './tab.module.css';
import useAppTabsStore from '../../app-tabs.store';
import { getCloseTabButton, getTabIconElement, getTabStyleClass, onTabSelect } from './utils';
import { VISIBLE_TAB_WIDTH } from '../../constants';
import { useLocation } from 'wouter';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface ITabProps {
  config: ITabConfig;
  tabWidth?: string;
  isMoreTab?: boolean;
}

const Tab = ({ config, tabWidth, isMoreTab }: ITabProps): JSX.Element => {
  const { appTabsConfig } = useAppTabsStore();
  const [, setLocation] = useLocation();

  const updateUrl = (newUrl: string): void => {
    setLocation(newUrl);
  };

  return (
    <Tooltip
      trigger={[Trigger.Hover]}
      content={config?.customTooltipMessage ?? config?.title}
      placement={Placement.Vertical}
      theme={Theme.Dark}>
      <button
        className={`${styles.tab_wrapper} ${getTabStyleClass(config)}`}
        style={{ width: tabWidth ?? VISIBLE_TAB_WIDTH }}
        onClick={() => {
          onTabSelect({ config, appTabsConfig, updateUrl, isMoreTab });
        }}
        data-testid="app-tab">
        {getTabIconElement(config)}
        <div className={styles.tab_title}>{config?.title}</div>
        {getCloseTabButton(config, appTabsConfig, updateUrl)}
      </button>
    </Tooltip>
  );
};

Tab.defaultProps = {
  tabWidth: undefined,
  isMoreTab: undefined
};

export default Tab;
