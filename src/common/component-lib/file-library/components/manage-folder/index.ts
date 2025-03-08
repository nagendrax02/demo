import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ManageFolder = withSuspense(lazy(() => import('./ManageFolder')));

export default ManageFolder;
