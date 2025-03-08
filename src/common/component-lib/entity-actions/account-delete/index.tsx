import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AccountDelete = withSuspense(lazy(() => import('./AccountDelete')));
export default AccountDelete;
