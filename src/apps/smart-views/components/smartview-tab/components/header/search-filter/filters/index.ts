import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Filters = withSuspense(lazy(() => import('./Filters')));

export default Filters;
