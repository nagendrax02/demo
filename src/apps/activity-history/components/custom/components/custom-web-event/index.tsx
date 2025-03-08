import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const CustomWebEvent = withSuspense(lazy(() => import('./CustomWebEvent')));

export default CustomWebEvent;
