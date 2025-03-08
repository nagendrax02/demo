import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const BulkUpdate = withSuspense(lazy(() => import('./BulkUpdate')));

export default BulkUpdate;
