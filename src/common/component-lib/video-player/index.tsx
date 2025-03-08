import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const VideoPlayer = withSuspense(lazy(() => import('./VideoPlayer')));
export default VideoPlayer;
