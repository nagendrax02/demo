import { ITabResponse } from 'apps/smart-views/smartviews.types';
import TabIcon from './TabIcon';
import useSmartViewStore, { setActiveTabId } from 'apps/smart-views/smartviews-store';
import styles from './tab-item.module.css';
import { clearExperience } from 'common/utils/experience/experience.store';
import { ExperienceModule, ExperienceType } from 'common/utils/experience';
import { SVLoadExperienceKey } from 'common/utils/experience/constant';
import { isCustomTypeTab, startSVTabLoadExperience } from 'apps/smart-views/utils/utils';
import { updateActiveTabIdInUrl, updateAppVisibilityState } from 'common/utils/helpers/helpers';
import { setActiveTab, useRecordCount } from '../../../smartview-tab/smartview-tab.store';
import { setFullScreenRecords } from 'common/component-lib/full-screen-header';
import { useRef } from 'react';

interface ITabItem {
  tabData: ITabResponse;
  onClick?: (tabId: string) => void;
  styleClass?: string;
}

const TabItem = (props: ITabItem): JSX.Element => {
  const { tabData, onClick, styleClass } = props;
  const primaryColor = tabData.TabConfiguration.PrimaryColor;
  const tabPrimaryColorCssVariable: string = '--tab-primary-color';
  const { activeTabId } = useSmartViewStore();
  const renderedTabs = useRef<Record<string, boolean>>({ [activeTabId]: true });

  let recordCount = useRecordCount(tabData?.Id);
  if (isCustomTypeTab(tabData)) {
    recordCount = tabData.Count ?? 0;
  }

  const handleOnClick = (): void => {
    setActiveTab(tabData.Id);
    setActiveTabId(tabData.Id);
    updateActiveTabIdInUrl(tabData.Id);
    setFullScreenRecords([]);
    renderedTabs.current[tabData.Id] = true;

    onClick?.(tabData.Id);
    //Clear SV Load Experience
    clearExperience([
      {
        module: ExperienceModule?.SmartViews,
        experience: ExperienceType.Load,
        key: SVLoadExperienceKey
      },
      {
        module: ExperienceModule.SmartViews,
        experience: ExperienceType.SVTabSwitch,
        key: tabData.Id
      }
    ]);

    //Update visibility state of page
    updateAppVisibilityState(false);

    //Start SV Tab Load Experience
    startSVTabLoadExperience(tabData.Id);
  };

  const isTabRendered = (): boolean => {
    return renderedTabs.current[tabData.Id];
  };

  const getFormattedCount = (count: number): string => {
    // billion count
    if (count >= 1e9) {
      return `${Number((count / 1e9).toFixed(2)).toString()}B`;
    }
    // million count
    if (count >= 1e6) {
      return `${Number((count / 1e6).toFixed(2)).toString()}M`;
    }
    // thousand count
    return `${Number((count / 1e3).toFixed(2)).toString()}K`;
  };

  const getRecordCount = (): string | null => {
    const count = recordCount > 999 ? getFormattedCount(recordCount) : `${recordCount}`;
    return isTabRendered() ? count : null;
  };

  return (
    <div
      className={styleClass}
      style={{ [tabPrimaryColorCssVariable]: `${primaryColor}` }}
      onClick={handleOnClick}
      title={tabData?.TabConfiguration?.Title || ''}>
      <TabIcon tabType={tabData?.Type} customType={tabData?.TabConfiguration?.CustomType} />
      <span className={`${styles.tab_title} title`}>{tabData.TabConfiguration.Title}</span>
      {getRecordCount() ? <span className={styles.record_count}>{getRecordCount()}</span> : null}
    </div>
  );
};

TabItem.defaultProps = {
  styleClass: '',
  onClick: (): void => {}
};

export default TabItem;
