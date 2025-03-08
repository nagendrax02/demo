import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

export default withSuspense(lazy(() => import('./ManageListsTab')));
