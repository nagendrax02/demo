import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const FileLibrary = withSuspense(lazy(() => import('./FileLibrary')));

export default FileLibrary;
