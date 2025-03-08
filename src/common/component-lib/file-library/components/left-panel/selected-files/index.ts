import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const SelectedFiles = withSuspense(lazy(() => import('./SelectedFiles')));

export default SelectedFiles;
