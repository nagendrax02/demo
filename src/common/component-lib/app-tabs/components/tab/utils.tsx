import Icon from '@lsq/nextgen-preact/icon';
import { removeTab, setAppTabsConfig } from '../../app-tabs.store';
import { ITabConfig, TabType } from '../../app-tabs.types';
import { getTabIcon } from '../../utils/render-utils';
import styles from './tab.module.css';
import { trackError } from 'common/utils/experience';
import { setIsStoreResetNeeded } from 'common/utils/helpers/helpers';

export const getBaseUrlFromBrowser = (): string => {
  return window.location.origin;
};

export const onTabClose = (
  config: ITabConfig,
  appTabsConfig: ITabConfig[],
  updateUrl: (newUrl: string) => void
): void => {
  if (config.isActiveTab) {
    let newTabUrl = getBaseUrlFromBrowser();
    const currentTabIndex = appTabsConfig.findIndex((tab) => tab.id === config?.id);

    // TO DO: need to verify if this behavior is fine
    if (appTabsConfig?.[currentTabIndex + 1]) {
      newTabUrl = appTabsConfig?.[currentTabIndex + 1].url;
    } else if (appTabsConfig?.[currentTabIndex - 1]) {
      newTabUrl = appTabsConfig?.[currentTabIndex - 1].url;
    }

    removeTab(config.id);

    if (newTabUrl) {
      updateUrl(newTabUrl);
    }
  } else {
    removeTab(config.id);
  }
};

export const getTabIconElement = (config: ITabConfig): JSX.Element | null => {
  if (config?.type === TabType.Secondary) {
    return <div className={styles.tab_icon}>{getTabIcon(config)}</div>;
  }
  return null;
};

export const getCloseTabButton = (
  config: ITabConfig,
  appTabsConfig: ITabConfig[],
  updateUrl: (newUrl: string) => void
): JSX.Element | null => {
  if (config?.type === TabType.Secondary) {
    return (
      <button
        className={styles.tab_close}
        onClick={(e) => {
          e.stopPropagation();
          onTabClose(config, appTabsConfig, updateUrl);
        }}>
        <Icon name="close" />
      </button>
    );
  }
  return null;
};

export const onTabSelect = ({
  config,
  appTabsConfig,
  updateUrl,
  isMoreTab
}: {
  config: ITabConfig;
  appTabsConfig: ITabConfig[];
  updateUrl: (newUrl: string) => void;
  isMoreTab?: boolean;
}): void => {
  if (config?.isActiveTab) {
    return;
  } else {
    setIsStoreResetNeeded(true);
    if (isMoreTab) {
      /* If its a more tab, set it in the beginning (if primary tab is present, then put it in 2nd position, else put in 1st position)*/
      const tabIndex = appTabsConfig.findIndex((item) => item.id === config.id);
      const existingPrimaryTabIndex = appTabsConfig.findIndex(
        (tab) => tab.type === TabType.Primary
      );
      const [tab] = appTabsConfig.splice(tabIndex, 1);
      const insertIndex = existingPrimaryTabIndex !== -1 ? 1 : 0;
      appTabsConfig.splice(insertIndex, 0, tab);
      setAppTabsConfig([...appTabsConfig]);
    }
    updateUrl(config?.url);
  }
};

export const getTabStyleClass = (config: ITabConfig): string => {
  try {
    const stylesArray: string[] = [''];

    if (config?.showErrorState) {
      stylesArray.push(styles.error_state);
    } else if (config?.type === TabType.Primary) {
      stylesArray.push(styles.primary_tab);
    } else {
      stylesArray.push(styles.secondary_tab);
    }

    if (config?.isActiveTab) {
      stylesArray.push(styles.is_active_tab);
    }

    return stylesArray?.join(' ');
  } catch (err) {
    trackError(err);
  }
  return '';
};
