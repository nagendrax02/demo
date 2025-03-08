import { lazy, ReactNode, useRef } from 'react';
import { useAuthenticationStatus } from 'common/utils/authentication';
import useOnAuthSuccess from 'common/utils/authentication/hooks/on-auth-success';
import { isMiP, roundOffDecimal } from 'common/utils/helpers/helpers';
import { useReloadApp } from '../store/reload-app';
import Spinner from '@lsq/nextgen-preact/spinner';
import styles from './layout.module.css';
import MipNavigation from 'common/component-lib/mip-navigation';
import Router from '../router';
import Authentication from 'apps/authentication';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import useAppHeaderStore from 'common/component-lib/app-header/app-header.store';

const SplashScreen = withSuspense(lazy(() => import('common/component-lib/splash-screen')));
const AppHeader = withSuspense(lazy(() => import('common/component-lib/app-header')));

const AuthenticationError = withSuspense(
  lazy(() => import('apps/authentication/AuthenticationError'))
);

const LayoutRenderer = (): ReactNode => {
  const layoutReachTime = useRef(roundOffDecimal(performance?.now()));
  const reloadAppKey = useReloadApp((state) => state.reloadAppKey);
  const { authStatus, setAuthStatus } = useAuthenticationStatus(layoutReachTime?.current);
  const { data, status } = useOnAuthSuccess(authStatus);
  const enableAppHeader = getItem(StorageKey.EnableAppHeader) || false;

  const isAppHeaderLoading = useAppHeaderStore((state) => state.isLoading);

  const getHeader = (): ReactNode => {
    return enableAppHeader ? <AppHeader /> : <MipNavigation header={data?.header} />;
  };

  // eslint-disable-next-line complexity
  function componentToRender(): ReactNode {
    if (status.loading) {
      return <Spinner customStyleClass={styles.layout_spinner_container} />;
    }

    if (!authStatus.isSuccess) {
      return isMiP() ? <AuthenticationError /> : <Authentication setAuthStatus={setAuthStatus} />;
    }

    if (!data?.header?.length && !isMiP()) {
      return <>Header data is not available.</>;
    }

    return (
      <>
        {enableAppHeader && isAppHeaderLoading ? <SplashScreen /> : null}
        {!isMiP() ? getHeader() : null}
        <div
          className={enableAppHeader ? styles.ng_route_container : styles.route_container}
          key={reloadAppKey}>
          <Router />
        </div>
      </>
    );
  }

  return (
    <div className={styles.layout} data-testid="layout-page-container">
      {componentToRender()}
    </div>
  );
};

export default LayoutRenderer;
