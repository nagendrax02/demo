import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Edit = withSuspense(lazy(() => import('./Edit')));

export default Edit;
