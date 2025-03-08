import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Delete = withSuspense(lazy(() => import('./Delete')));

export default Delete;
