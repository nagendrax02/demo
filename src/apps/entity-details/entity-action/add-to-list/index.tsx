import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AddToList = withSuspense(lazy(() => import('./AddToList')));

export default AddToList;
