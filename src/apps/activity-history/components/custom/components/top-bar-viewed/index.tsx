import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TopBarViewed = withSuspense(lazy(() => import('./TopBarViewed')));

export default TopBarViewed;
