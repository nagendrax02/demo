import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Opportunity = withSuspense(lazy(() => import('./Opportunity')));

export default Opportunity;
