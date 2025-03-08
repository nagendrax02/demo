import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const LeadShareHistory = withSuspense(lazy(() => import('./LeadShareHistory')));

export default LeadShareHistory;
