import Icon from '@lsq/nextgen-preact/icon';
import styles from './tab-actions.module.css';
import ActionMenu from '@lsq/nextgen-preact/action-menu';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import AddNewTab from './components/add-new-tab';
import { useEffect, useState } from 'react';
import { IHandleManageTabs } from '../types/entitytabs.types';
import ManageTabs from './components/manage-tabs';
import useEntityTabsStore from '../store';
import { isActivityHistoryTabPresent } from '../utils/general';
import useEntityDetailStore from 'apps/entity-details/entitydetail.store';
import { EntityType } from 'src/common/types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { ENTITY_FEATURE_RESTRICTION_CONFIG_MAP } from 'common/constants/feature-restriction';
import { getUnrestrictedActions } from 'common/utils/feature-restriction';

interface ISettings {
  handleManageTab: IHandleManageTabs;
  coreData: IEntityDetailsCoreData;
}

const Settings = ({ handleManageTab, coreData }: ISettings): JSX.Element => {
  const [showAddNewTab, setShowAddNewTab] = useState(false);
  const [showManageTab, setShowManageTab] = useState(false);
  const [augmentedSettingsActions, setAugmentedSettingsActions] = useState<IMenuItem[]>([]);
  const tabConfig = useEntityTabsStore((state) => state.tabConfig) || [];

  const entityType = useEntityDetailStore((state) => state?.entityType);

  const handleAddNewTabModal = (show: boolean): void => {
    setShowAddNewTab(show);
  };
  const handleManageTabModal = (show: boolean): void => {
    setShowManageTab(show);
  };

  const getActions = (): IMenuItem[] => {
    const tabs: IMenuItem[] = [
      {
        id: 'manageTabs',
        value: 'manage_tabs',
        label: 'Manage Tabs',
        clickHandler: (): void => {
          handleManageTabModal(true);
        }
      }
    ];

    if (isActivityHistoryTabPresent(tabConfig) && entityType !== EntityType.Account) {
      tabs.unshift({
        id: 'addNewTab',
        value: 'add_new_tab',
        label: 'Add New Tab',
        clickHandler: (): void => {
          handleAddNewTabModal(true);
        }
      });
    }
    return tabs;
  };

  useEffect(() => {
    (async (): Promise<void> => {
      const augmentedActions = await getUnrestrictedActions<IMenuItem>(
        ENTITY_FEATURE_RESTRICTION_CONFIG_MAP?.[coreData?.entityDetailsType],
        getActions()
      );
      setAugmentedSettingsActions(augmentedActions);
    })();
  }, [tabConfig]);

  return (
    <>
      <ActionMenu menuKey="tabSettings" actions={augmentedSettingsActions}>
        <Icon
          name="settings"
          customStyleClass={styles.color_quaternary}
          variant={IconVariant.Filled}
          dataTestId="entity-tabs-settings"
        />
      </ActionMenu>
      {showAddNewTab ? (
        <AddNewTab
          setShow={handleAddNewTabModal}
          show={showAddNewTab}
          handleManageTab={handleManageTab}
          coreData={coreData}
        />
      ) : null}
      {showManageTab ? (
        <ManageTabs
          setShow={handleManageTabModal}
          show={showManageTab}
          handleManageTab={handleManageTab}
        />
      ) : null}
    </>
  );
};

export default Settings;
