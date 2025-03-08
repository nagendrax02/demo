import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const OpportunityName = withSuspense(lazy(() => import('./OpportunityName')));

export default OpportunityName;
