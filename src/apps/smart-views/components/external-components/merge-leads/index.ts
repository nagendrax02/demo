import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const MergeLeads = withSuspense(lazy(() => import('./MergeLeads')));

export default MergeLeads;
