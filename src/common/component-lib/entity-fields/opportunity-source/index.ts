import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const OpportunitySource = withSuspense(lazy(() => import('./OpportunitySource')));

export default OpportunitySource;
