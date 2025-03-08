import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const AccountName = withSuspense(lazy(() => import('./AccountName')));

export default AccountName;
