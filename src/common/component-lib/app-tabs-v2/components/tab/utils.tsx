import { removeTab, setAppTabsConfig } from '../../app-tabs.store';
import { ITabConfig } from '../../app-tabs.types';
import { getTabIcon } from '../../utils/render-utils';
import styles from './tab.module.css';
import { trackError } from 'common/utils/experience';
import { setIsStoreResetNeeded } from 'common/utils/helpers/helpers';
import { Close } from 'assets/custom-icon/v2';

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

export const getTabIconElement = (config: ITabConfig): JSX.Element => {
  return <div className={styles.tab_icon}>{getTabIcon(config)}</div>;
};

export const getCloseTabButton = (
  config: ITabConfig,
  appTabsConfig: ITabConfig[],
  updateUrl: (newUrl: string) => void
): JSX.Element => {
  return (
    <button
      className={styles.tab_close}
      onClick={(e) => {
        e.stopPropagation();
        onTabClose(config, appTabsConfig, updateUrl);
      }}>
      <Close type="outline" />
    </button>
  );
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

      const [tab] = appTabsConfig.splice(tabIndex, 1);
      appTabsConfig.splice(0, 0, tab);
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
    } else {
      stylesArray.push(styles.base_tab);
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

export const getTabTitleStyleClass = (config: ITabConfig): string => {
  try {
    const stylesArray: string[] = ['ng_v2_style'];

    if (config?.isActiveTab) {
      stylesArray.push('ng_p_1_b');
    } else {
      stylesArray.push('ng_p_1_sb');
    }

    return stylesArray?.join(' ');
  } catch (err) {
    trackError(err);
  }
  return '';
};
