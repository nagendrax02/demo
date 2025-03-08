import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const OpportunityLink = withSuspense(lazy(() => import('./OpportunityLink')));

export default OpportunityLink;
