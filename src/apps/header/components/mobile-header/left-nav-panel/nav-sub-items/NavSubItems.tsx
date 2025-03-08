import { trackError } from 'common/utils/experience/utils/track-error';
import { useState, useEffect } from 'react';
import { INavItem } from 'apps/header/header.types';
import { Module, httpGet, CallerSource } from 'common/utils/rest-client';
import styles from '../left-nav-panel.module.css';
import NavSubItem from './NavSubItem';

interface INavSubItemS {
  navItem: INavItem;
}

const NavSubItems = ({ navItem }: INavSubItemS): JSX.Element => {
  const [shimmer, setShimmer] = useState(true);
  const [navSubItems, setNavSubItems] = useState<INavItem[]>();

  const fetchNavSubItems = async (): Promise<void> => {
    try {
      setShimmer(true);
      const response: INavItem[] = await httpGet({
        path: navItem?.ChildConfig?.RelativeURL,
        module: Module.Marvin,
        callerSource: CallerSource.NA
      });
      setShimmer(false);
      if (response) setNavSubItems(response);
    } catch (error) {
      trackError('error in fetchNavSubItems', error);
    }
  };

  useEffect(() => {
    fetchNavSubItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.nav_sub_items_wrapper}>
      {shimmer ? (
        // TODO: Fix shimmer
        <>Shimmer...</>
      ) : (
        <>
          {navSubItems?.map((subItem) => {
            return <NavSubItem key={subItem.Id} subItem={subItem} />;
          })}
        </>
      )}
    </div>
  );
};

export default NavSubItems;
