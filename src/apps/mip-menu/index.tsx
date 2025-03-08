import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const MipMenu = withSuspense(lazy(() => import('./MipMenu')));

export default MipMenu;
