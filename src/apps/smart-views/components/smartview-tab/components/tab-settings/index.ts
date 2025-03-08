import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TabSettings = withSuspense(lazy(() => import('./TabSettings')));

export default TabSettings;
