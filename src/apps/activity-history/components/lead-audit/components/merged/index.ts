import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Merged = withSuspense(lazy(() => import('./Merged')));

export default Merged;
