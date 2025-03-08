import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DraftsEmptyState = withSuspense(lazy(() => import('./DraftsEmptyState')));

export default DraftsEmptyState;
