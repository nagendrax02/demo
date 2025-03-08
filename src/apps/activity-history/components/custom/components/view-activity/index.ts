import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ViewActivity = withSuspense(lazy(() => import('./ViewActivity')));

export default ViewActivity;
