import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DeleteFolder = withSuspense(lazy(() => import('./DeleteFolder')));

export default DeleteFolder;
