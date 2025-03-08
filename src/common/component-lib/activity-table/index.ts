import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ActivityTable = withSuspense(lazy(() => import('./ActivityTable')));

export default ActivityTable;
