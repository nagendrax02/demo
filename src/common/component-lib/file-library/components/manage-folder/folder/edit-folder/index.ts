import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EditFolder = withSuspense(lazy(() => import('./EditFolder')));

export default EditFolder;
