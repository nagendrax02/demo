import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const PopupMenu = withSuspense(lazy(() => import('./PopupMenu')));

export default PopupMenu;
