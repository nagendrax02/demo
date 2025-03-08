import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DeleteModal = lazy(() => import('./DeleteModal'));

export default withSuspense(DeleteModal);
