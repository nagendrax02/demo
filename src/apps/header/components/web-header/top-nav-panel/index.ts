import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TopNavPanel = withSuspense(lazy(() => import('./TopNavPanel')));

export default TopNavPanel;
