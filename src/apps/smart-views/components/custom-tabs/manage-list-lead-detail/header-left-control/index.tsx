import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const HeaderLeftControls = withSuspense(lazy(() => import('./HeaderLeftControls')));
export default HeaderLeftControls;
