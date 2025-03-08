import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const FullScreenEntityDetails = withSuspense(lazy(() => import('./FullScreenEntityDetails')));

export default FullScreenEntityDetails;
