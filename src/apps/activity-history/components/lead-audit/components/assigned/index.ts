import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Assigned = withSuspense(lazy(() => import('./Assigned')));

export default Assigned;
