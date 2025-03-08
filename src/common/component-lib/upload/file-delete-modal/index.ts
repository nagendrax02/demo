import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const FileDeleteModal = withSuspense(lazy(() => import('./FileDeleteModal')));

export default FileDeleteModal;
