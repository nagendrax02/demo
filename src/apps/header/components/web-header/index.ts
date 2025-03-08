import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const WebHeader = withSuspense(lazy(() => import('./WebHeader')));

export default WebHeader;
