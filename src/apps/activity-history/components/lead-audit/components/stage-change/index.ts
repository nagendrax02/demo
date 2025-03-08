import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const StageChange = withSuspense(lazy(() => import('./StageChange')));

export default StageChange;
