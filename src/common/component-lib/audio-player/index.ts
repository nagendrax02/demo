import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AudioPlayer = withSuspense(lazy(() => import('./AudioPlayer')));

export default AudioPlayer;
