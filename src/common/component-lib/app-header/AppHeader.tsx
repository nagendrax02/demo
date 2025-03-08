import Actions from './actions';
import styles from './app-header.module.css';
import Navigation from './navigation';
import TenantLogo from './tenant-logo';
import useAppHeader from './use-app-header';

/**
 * The main header of the application.
 *
 * It consists of the following elements:
 * - Tenant logo
 * - Navigation
 * - App tabs
 * - Actions - Search, Draft forms
 * - User profile
 *
 * Epic: https://leadsquared.atlassian.net/browse/SW-6322
 */

const AppHeader = (): JSX.Element => {
  const { selectedModuleItemId, selectedModuleId, appHeaderData, navigationReferenceMap } =
    useAppHeader();

  return (
    <div className={styles.outer_container}>
      <div className={styles.inner_container}>
        <TenantLogo />
        <Navigation
          data={appHeaderData.NavigationMenu}
          navigationReferenceMap={navigationReferenceMap}
          selectedModuleId={selectedModuleId}
          selectedModuleItemId={selectedModuleItemId}
        />
        <Actions data={appHeaderData?.Actions} />
      </div>
    </div>
  );
};

export default AppHeader;
