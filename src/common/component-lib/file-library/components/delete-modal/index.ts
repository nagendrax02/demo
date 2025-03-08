import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DeleteModal = withSuspense(lazy(() => import('./DeleteModal')));

export default DeleteModal;
