import TabIcon from './TabIcon';
import useSmartViewStore, { setActiveTabId } from 'apps/smart-views/smartviews-store';
import styles from './sv-tab-item.module.css';
import { clearExperience } from 'common/utils/experience/experience.store';
import { ExperienceModule, ExperienceType } from 'common/utils/experience';
import { SVLoadExperienceKey } from 'common/utils/experience/constant';
import { startSVTabLoadExperience } from 'apps/smart-views/utils/utils';
import {
  classNames,
  updateActiveTabIdInUrl,
  updateAppVisibilityState
} from 'common/utils/helpers/helpers';
import { setFullScreenRecords } from 'common/component-lib/full-screen-header';
import { useContext, useRef, useState } from 'react';
import { PanelItem } from '@lsq/nextgen-preact/panel';
import { ISelectionProps } from '@lsq/nextgen-preact/panel/panel.types';
import { setActiveTab } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { OrientationContext } from 'apps/smart-views/SmartViews';
import { PanelOrientation } from 'apps/smart-views/constants/constants';
import { setInDB, StorageKey } from 'common/utils/storage-manager';

interface ITabItem {
  onClick?: (tabId: string) => void;
  id: string;
  setShowMoreOptions?: (showMoreOptions: boolean) => void;
  overflowTab?: boolean;
}

const SVTabItem = (props: ITabItem): JSX.Element => {
  const { onClick, id, setShowMoreOptions, overflowTab } = props;
  const { rawTabData, activeTabId } = useSmartViewStore();
  const renderedTabs = useRef<Record<string, boolean>>({ [activeTabId]: true });
  const orientationContext = useContext(OrientationContext);
  const panelOrientation = orientationContext?.panelOrientation;

  const isLeftOriented = panelOrientation === PanelOrientation.Left;
  const isSelected = id === activeTabId;
  const tabData = rawTabData?.[id];

  const primaryColor = tabData.TabConfiguration.PrimaryColor;

  const [isHovered, setIsHovered] = useState(false);

  const handleOnClick = (): void => {
    if (setShowMoreOptions) setShowMoreOptions(false);
    setActiveTab(tabData.Id);
    setActiveTabId(tabData.Id);
    updateActiveTabIdInUrl(tabData.Id);
    setInDB(StorageKey.SmartViewsActiveTabId, tabData.Id, true);
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

  const getCustomSelectionStyles = (): string => {
    if (!isLeftOriented) {
      if (overflowTab) {
        return styles.sv_more_content_selected;
      } else {
        return styles.sv_content_top_selected;
      }
    }
    return '';
  };

  const getSelectionProps = (): ISelectionProps => {
    return {
      isSelectable: true,
      isSelected,
      onContentClick: handleOnClick,
      customSelectionStyles: getCustomSelectionStyles()
    };
  };

  const getContainerStyles = (): string => {
    if (isLeftOriented) {
      return styles.sv_content;
    } else {
      if (overflowTab) {
        return styles.sv_overflow_tab;
      } else {
        return styles.sv_content_top;
      }
    }
  };

  return (
    <PanelItem
      contentStyles={getContainerStyles()}
      selectionProps={getSelectionProps()}
      hoverProps={{
        isHoverable: true,
        onContentHover: () => {
          setIsHovered(!isHovered);
        },
        customHoverStyles: overflowTab && !isLeftOriented ? styles.sv_more_tab_hover : ''
      }}
      contentId={tabData.Id}>
      <TabIcon
        tabType={tabData?.Type}
        customType={tabData?.TabConfiguration?.CustomType}
        isSelected={isSelected}
        isHovered={isHovered}
        primaryColor={primaryColor}
      />
      <span
        className={classNames(
          styles.sv_tab_title,
          'ng_p_1_m',
          isSelected ? styles.sv_tab_title_selected : ''
        )}>
        {tabData?.TabConfiguration?.Title ? tabData?.TabConfiguration?.Title : ''}
      </span>
    </PanelItem>
  );
};

SVTabItem.defaultProps = {
  onClick: (): void => {},
  setShowMoreOptions: (): void => {},
  overflowTab: false
};

export default SVTabItem;
