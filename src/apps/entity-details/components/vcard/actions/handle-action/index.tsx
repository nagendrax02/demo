import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
const HandleAction = withSuspense(lazy(() => import('./HandleAction')));

export default HandleAction;
