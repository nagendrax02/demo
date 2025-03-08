import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const BottomNavPanel = withSuspense(lazy(() => import('./BottomNavPanel')));

export default BottomNavPanel;
