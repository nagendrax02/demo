import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const PlatformPage = withSuspense(lazy(() => import('./PlatformPage')));

export default PlatformPage;
