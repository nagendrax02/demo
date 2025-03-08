import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const OpportunityStatus = withSuspense(lazy(() => import('./OpportunityStatus')));

export default OpportunityStatus;
