import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const EmptyState = withSuspense(lazy(() => import('./EmptyState')));

export default EmptyState;
