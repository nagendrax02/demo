import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ActivityDetailsModal = withSuspense(lazy(() => import('./ActivityDetailsModal')));

export default ActivityDetailsModal;
