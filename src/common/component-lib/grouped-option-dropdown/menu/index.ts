import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
const Menu = withSuspense(lazy(() => import('./Menu')));

export default Menu;
