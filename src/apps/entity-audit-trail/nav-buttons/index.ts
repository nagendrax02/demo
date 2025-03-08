import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const NavButtons = withSuspense(lazy(() => import('./NavButtons')));

export default NavButtons;
