import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const MediaLink = withSuspense(lazy(() => import('./MediaLink')));

export default MediaLink;
