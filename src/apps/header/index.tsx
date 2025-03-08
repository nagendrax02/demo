import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Header = withSuspense(lazy(() => import('./Header')));

export default Header;
