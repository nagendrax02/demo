import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const DueDate = withSuspense(lazy(() => import('./DueDate')));

export default DueDate;
