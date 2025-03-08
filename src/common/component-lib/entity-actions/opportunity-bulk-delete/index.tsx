import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const OpportunityDelete = withSuspense(lazy(() => import('./OpportunityDelete')));
export default OpportunityDelete;
