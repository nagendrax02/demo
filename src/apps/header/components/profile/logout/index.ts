import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Logout = withSuspense(lazy(() => import('./Logout')));

export default Logout;
