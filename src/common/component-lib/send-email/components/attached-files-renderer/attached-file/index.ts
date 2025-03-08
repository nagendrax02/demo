import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AttachedFile = withSuspense(lazy(() => import('./AttachedFile')));

export default AttachedFile;
