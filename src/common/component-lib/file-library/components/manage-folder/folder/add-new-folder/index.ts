import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AddNewFolder = withSuspense(lazy(() => import('./AddNewFolder')));

export default AddNewFolder;
