import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const SmartViews = withSuspense(lazy(() => import('./SmartViews')));

export default SmartViews;
