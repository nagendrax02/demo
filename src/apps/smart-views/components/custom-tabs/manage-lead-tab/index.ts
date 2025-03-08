import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

export default withSuspense(lazy(() => import('./ManageLeadTab')));
