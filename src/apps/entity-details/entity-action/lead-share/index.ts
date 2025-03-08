import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const LeadShare = withSuspense(lazy(() => import('./LeadShare')));

export default LeadShare;
