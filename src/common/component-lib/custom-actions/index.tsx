import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const CustomActions = withSuspense(lazy(() => import('./CustomActions')));

export default CustomActions;
