import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const GlobalSearch = withSuspense(lazy(() => import('./GlobalSearch')));

export default GlobalSearch;
