import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const MediaModal = withSuspense(lazy(() => import('./MediaModal')));

export default MediaModal;
