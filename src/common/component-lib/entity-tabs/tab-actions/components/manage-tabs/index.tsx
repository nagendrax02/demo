import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ManageTabs = withSuspense(lazy(() => import('./ManageTabs')));

export default ManageTabs;
