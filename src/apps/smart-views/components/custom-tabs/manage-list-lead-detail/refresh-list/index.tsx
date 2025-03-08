import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const RefreshList = withSuspense(lazy(() => import('./RefreshList')));

export default RefreshList;
