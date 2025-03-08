import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ConflictedRowIcon = withSuspense(lazy(() => import('./ConflictedRowIcon')));
export default ConflictedRowIcon;
