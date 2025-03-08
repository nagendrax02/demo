import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TrackLocation = withSuspense(lazy(() => import('./TrackLocation')));

export default TrackLocation;
