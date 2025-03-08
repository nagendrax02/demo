import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const SalesActivityTab = withSuspense(lazy(() => import('./SalesActivityTab')));

export default SalesActivityTab;
