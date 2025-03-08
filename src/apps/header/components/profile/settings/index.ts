import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Settings = withSuspense(lazy(() => import('./Settings')));

export default Settings;
