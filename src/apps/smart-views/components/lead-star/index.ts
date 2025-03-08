import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const LeadStar = withSuspense(lazy(() => import('./LeadStar')));

export default LeadStar;
