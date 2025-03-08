import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Refresh = withSuspense(lazy(() => import('./Refresh')));

export default Refresh;
