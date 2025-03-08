import { lazy } from 'react';
import { useNotificationStore } from '@lsq/nextgen-preact/notification';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { getCurrentTheme } from '@lsq/nextgen-preact/v2/stylesmanager';
import LayoutRenderer from './LayoutRenderer';
import useLayout from './use-layout';

const Notification = withSuspense(lazy(() => import('@lsq/nextgen-preact/notification')));
const NewFormRenderer = withSuspense(
  lazy(() => import('apps/forms/form-renderer/new-form-renderer'))
);
const NotificationWrapper = (): JSX.Element | null => {
  const { notification } = useNotificationStore();
  return notification ? <Notification theme={getCurrentTheme()} /> : null;
};

const Layout = (): JSX.Element => {
  useLayout();
  return (
    <>
      <LayoutRenderer />
      <NotificationWrapper />
      <NewFormRenderer />
    </>
  );
};

export default Layout;
