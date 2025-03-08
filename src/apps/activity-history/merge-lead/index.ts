import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const MergeLead = withSuspense(lazy(() => import('./MergeLead')));

export default MergeLead;
