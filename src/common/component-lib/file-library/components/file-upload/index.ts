import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const FileUpload = withSuspense(lazy(() => import('./FileUpload')));

export default FileUpload;
