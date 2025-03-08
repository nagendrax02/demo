import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const DeleteModal = withSuspense(lazy(() => import('./DeleteModal')));
export default DeleteModal;
