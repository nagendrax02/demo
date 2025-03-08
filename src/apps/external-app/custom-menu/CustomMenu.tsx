import { useEffect, useRef, useState } from 'react';
import { getCustomMenuApps, normalizedCustomMenuAppsList } from './utils';
import { ICustomMenu, ICustomMenuResponse } from './custom-menu.types';
import LeftPanel from '../components/LeftPanel';
import { IExternalNavItem } from 'common/utils/helpers/helpers.types';
import styles from './styles.module.css';
import RightPanel from './right-panel/RightPanel';
import { CallerSource } from 'common/utils/rest-client';

const CustomMenu = (): JSX.Element => {
  const [appsList, setAppList] = useState<IExternalNavItem[]>();
  const [selectedMenu, setSelectedMenu] = useState<IExternalNavItem>();
  const appListDictionary = useRef<Record<string, ICustomMenu>>({});
  const defaultIframeAttributes = useRef('');

  useEffect(() => {
    (async (): Promise<void> => {
      const menus = (await getCustomMenuApps()) as ICustomMenuResponse;
      const { normalizedMenus, dictionary } = await normalizedCustomMenuAppsList(
        menus,
        CallerSource.MarvinHeader
      );

      appListDictionary.current = dictionary;
      defaultIframeAttributes.current = menus?.DefaultIframeAttributes;
      setAppList(normalizedMenus);
      setSelectedMenu(normalizedMenus?.[0]);
    })();
  }, []);

  const onMenuSelect = (menu: IExternalNavItem): void => {
    setSelectedMenu(menu);
  };
  return (
    <div className={styles.custom_menu_wrapper}>
      {appsList?.length ? (
        <LeftPanel
          title="Apps"
          menuItems={appsList}
          onSelect={onMenuSelect}
          selectedItem={selectedMenu || appsList?.[0]}
        />
      ) : null}

      {appListDictionary.current[selectedMenu?.Id || ''] ? (
        <RightPanel
          selectedMenu={appListDictionary.current[selectedMenu?.Id || '']}
          defaultIframeAttributes={defaultIframeAttributes.current}
          key={appListDictionary.current[selectedMenu?.Id || '']?.customId}
        />
      ) : null}
    </div>
  );
};

export default CustomMenu;
