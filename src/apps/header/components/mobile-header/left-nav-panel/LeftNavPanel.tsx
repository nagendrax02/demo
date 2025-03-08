import { lazy, useEffect, useState } from 'react';
import useHeaderStore from 'apps/header/header.store';
import Icon from '@lsq/nextgen-preact/icon';
import withSuspense from '@lsq/nextgen-preact/suspense';
import styles from 'apps/header/components/styles.module.css';

const NavPanel = withSuspense(lazy(() => import('./NavPanel')));

const LeftNavPanel = (): JSX.Element => {
  const [showNavPanel, setShowNavPanel] = useState(false);

  const activeNavItemName = useHeaderStore((state) => state.activeNavItemName);

  useEffect(() => {
    if (activeNavItemName) setShowNavPanel(false);
  }, [activeNavItemName]);

  const onMenuIconClick = (): void => {
    setShowNavPanel(true);
  };

  return (
    <>
      <div className={styles.nav_item} onClick={onMenuIconClick}>
        <Icon name="menu" />
      </div>
      {showNavPanel ? <NavPanel show={showNavPanel} setShow={setShowNavPanel} /> : null}
    </>
  );
};

export default LeftNavPanel;
