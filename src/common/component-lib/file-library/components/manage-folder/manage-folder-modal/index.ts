import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ManageFolderModal = withSuspense(lazy(() => import('./ManageFolderModal')));

export default ManageFolderModal;
