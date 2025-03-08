import { lazy } from 'react';
import { getFileExtension } from './utils';
import withSuspense from '@lsq/nextgen-preact/suspense';
const Upload = withSuspense(lazy(() => import('./Upload')));

export default Upload;
export { getFileExtension };
