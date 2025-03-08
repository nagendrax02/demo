import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AddNewTab = withSuspense(lazy(() => import('./AddNewTab')));

export default AddNewTab;
