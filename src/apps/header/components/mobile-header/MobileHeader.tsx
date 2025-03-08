import useFetchNavItems from 'apps/header/use-fetch-nav-items';
import LeftNavPanel from './left-nav-panel';
import RightNavPanel from './right-nav-panel';
import styles from './mobile-header.module.css';

const MobileHeader = (): JSX.Element => {
  const { isLoading } = useFetchNavItems();

  // TODO: Fix shimmer
  if (isLoading) return <>Loading...</>;

  return (
    <div className={styles.mobile_header}>
      <LeftNavPanel />
      <RightNavPanel />
    </div>
  );
};

export default MobileHeader;
