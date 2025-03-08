import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const CustomEmailSubscription = withSuspense(lazy(() => import('./CustomEmailSubscription')));

export default CustomEmailSubscription;
