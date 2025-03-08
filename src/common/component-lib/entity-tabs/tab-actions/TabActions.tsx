import OverflownTabs from './OverflownTabs';
import Refresh from './Refresh';
import styles from './tab-actions.module.css';
import Settings from './Settings';
import { isMobileDevice } from 'common/utils/helpers';
import ActionShimmer from './ActionShimmer';
import { IHandleManageTabs } from '../types/entitytabs.types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { useEffect, useState } from 'react';
import { isSettingsActionRestricted } from './utils';

interface ITabActions {
  isLoading: boolean;
  handleManageTab: IHandleManageTabs;
  coreData: IEntityDetailsCoreData;
}

const TabActions = ({ isLoading, handleManageTab, coreData }: ITabActions): JSX.Element => {
  const [isSettingsLoading, setIsSettingsLoading] = useState<boolean>(true);
  const [isSettingsRestricted, setIsSettingsRestricted] = useState<boolean>(true);

  useEffect(() => {
    (async (): Promise<void> => {
      const response = await isSettingsActionRestricted(coreData?.entityDetailsType);
      setIsSettingsRestricted(response);
      setIsSettingsLoading(false);
    })();
  }, [coreData]);

  const getSettingsElement = (): JSX.Element => {
    if (isSettingsLoading) {
      return <ActionShimmer actionCount={1} />;
    }
    if (!isSettingsRestricted) {
      return <Settings handleManageTab={handleManageTab} coreData={coreData} />;
    }
    return <></>;
  };

  return (
    <div className={styles.tab_actions}>
      {isLoading ? (
        <ActionShimmer />
      ) : (
        <>
          <OverflownTabs />
          {!isMobileDevice() ? getSettingsElement() : null}
          <Refresh />
        </>
      )}
    </div>
  );
};

export default TabActions;
