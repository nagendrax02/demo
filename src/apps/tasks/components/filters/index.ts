import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Filters = withSuspense(lazy(() => import('./Filters')));

export default Filters;
