import { ActionWrapper } from 'common/component-lib/action-wrapper';
import { getConvertedPanelActions } from 'apps/smart-views/components/panel/utils';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from '../../panel.module.css';
import navStyles from '../navigation-box/navigation.module.css';
import { useState } from 'react';
import { Setting } from 'apps/smart-views/components/panel/constants';
import ManageTabs from '../manage-tabs';
import useSmartViewStore from 'apps/smart-views/smartviews-store';
import { PanelOrientation, panelSettings } from 'apps/smart-views/constants/constants';
import ConfigureTab from 'apps/smart-views/components/external-components/configure-tab';
import TabModal from './TabModal';
import { logSVModuleUsage } from 'apps/smart-views/utils/utils';

const Settings = (): JSX.Element => {
  const panel = useSmartViewStore((state) => state.panel);
  const allTabIds = useSmartViewStore((state) => state.allTabIds) || [];
  const maxAllowedTabs = useSmartViewStore(
    (state) => state?.commonTabSettings?.maxAllowedTabs
  ) as number;
  const [showSettingModal, setShowSettingModal] = useState({
    [Setting.ManageTabs]: false,
    [Setting.AddNewTab]: false
  });
  const [showTabLimit, setShowTabLimit] = useState(false);

  const panelAction = getConvertedPanelActions(panel);

  const handleSelect = (settingId: string): void => {
    if (settingId === Setting.AddNewTab && allTabIds?.length >= maxAllowedTabs) {
      setShowTabLimit(true);
      return;
    }
    setShowSettingModal({ ...showSettingModal, [settingId]: true });
  };

  const handleClose = (settingId: string): void => {
    setShowSettingModal({ ...showSettingModal, [settingId]: false });
  };

  const renderSetting = (): JSX.Element | null => {
    return (
      <>
        {showSettingModal[Setting.ManageTabs] ? (
          <ManageTabs
            show={showSettingModal[Setting.ManageTabs]}
            onClose={() => {
              handleClose(Setting.ManageTabs);
            }}
          />
        ) : null}
        {showSettingModal[Setting.AddNewTab] ? (
          <ConfigureTab
            show={showSettingModal[Setting.AddNewTab]}
            onClose={(show: boolean) => {
              if (!show) handleClose(Setting.AddNewTab);
            }}
          />
        ) : null}
      </>
    );
  };

  return (
    <>
      {panel?.orientation === PanelOrientation.Left ? (
        <ActionWrapper
          id={panelAction.id || ''}
          menuKey={panelAction.id || ''}
          action={panelAction}
          onMenuItemSelect={(menuItem) => {
            handleSelect(menuItem.value);
            logSVModuleUsage('', menuItem.value);
          }}>
          <Icon
            name="settings"
            variant={IconVariant.Filled}
            customStyleClass={styles.settings_icon}
          />
        </ActionWrapper>
      ) : (
        <div className={styles.top_panel_action_box}>
          <div
            className={navStyles.nav_box_tab_item}
            title={panelSettings.options[0].label}
            onClick={() => {
              handleSelect(Setting.AddNewTab);
            }}>
            <Icon
              name="add_box"
              variant={IconVariant.Outlined}
              customStyleClass={styles.top_panel_action_icon}
            />
            <span className="title">{panelSettings.options[0]?.label}</span>
          </div>
          <div
            className={navStyles.nav_box_tab_item}
            title={panelSettings.options[1].label}
            onClick={() => {
              handleSelect(Setting.ManageTabs);
            }}>
            <Icon
              name="settings"
              variant={IconVariant.Filled}
              customStyleClass={styles.top_panel_action_icon}
            />
            <span className="title">{panelSettings.options[1]?.label}</span>
          </div>
        </div>
      )}
      {renderSetting()}
      {showTabLimit ? (
        <TabModal show={showTabLimit} setShow={setShowTabLimit} maxAllowedTabs={maxAllowedTabs} />
      ) : null}
    </>
  );
};

export default Settings;
