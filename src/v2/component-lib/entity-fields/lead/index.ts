import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Lead = withSuspense(lazy(() => import('./Lead')));

export default Lead;
