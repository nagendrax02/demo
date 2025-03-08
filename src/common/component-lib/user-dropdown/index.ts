import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const UserDropdown = withSuspense(lazy(() => import('./UserDropdown')));

export default UserDropdown;
