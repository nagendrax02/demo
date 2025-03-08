import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AttachedFilesRenderer = withSuspense(lazy(() => import('./AttachedFilesRenderer')));

export default AttachedFilesRenderer;
