import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const CustomMenu = withSuspense(lazy(() => import('./CustomMenu')));
export default CustomMenu;
