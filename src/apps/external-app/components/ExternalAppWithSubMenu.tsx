import { trackError } from 'common/utils/experience/utils/track-error';
import { IModuleConfig } from 'common/types/authentication.types';
import LeftPanel from './LeftPanel';
import { useEffect, useState } from 'react';
import { getExternalAppHandler, getExternalAppPromise } from 'common/utils/helpers/external-app';
import { IExternalNavItem } from 'common/utils/helpers/helpers.types';
import { ExternalAppLoader } from '.';
import styles from '../external-app.module.css';

export interface IExternalAppWithSubMenu {
  appConfig: IModuleConfig;
}

const ExternalAppWithSubMenu = (props: IExternalAppWithSubMenu): JSX.Element => {
  const { appConfig } = props;
  const [menuItems, setMenuItems] = useState<IExternalNavItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<IExternalNavItem>();

  useEffect(() => {
    const fetchMenuItems = async (): Promise<void> => {
      await getExternalAppPromise(appConfig?.Name)?.promise;
      const externalAppHandler = getExternalAppHandler(appConfig?.Name);

      if (typeof externalAppHandler?.fetchSubMenuData === 'function') {
        try {
          const subMenuData = await externalAppHandler.fetchSubMenuData();
          if (subMenuData && Array.isArray(subMenuData)) {
            setMenuItems(subMenuData);
            setSelectedMenu(subMenuData[0]);
          }
        } catch (error) {
          trackError(error);
        }
      }
    };

    fetchMenuItems();
  }, []);

  const handleSelect = (selectedItem: IExternalNavItem): void => {
    setSelectedMenu(selectedItem);
  };

  return (
    <div className={styles.external_app_sub_menu_container}>
      <LeftPanel
        menuItems={menuItems}
        title={appConfig?.DisplayConfig?.DisplayName}
        selectedItem={selectedMenu || menuItems?.[0]}
        onSelect={handleSelect}
      />
      <ExternalAppLoader appConfig={appConfig} selectedSubMenuItem={selectedMenu} />
    </div>
  );
};

export default ExternalAppWithSubMenu;
