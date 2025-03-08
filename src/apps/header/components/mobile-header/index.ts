import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const MobileHeader = withSuspense(lazy(() => import('./MobileHeader')));

export default MobileHeader;
