import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const ManageTabs = withSuspense(lazy(() => import('./ManageTabs')));

export default ManageTabs;
