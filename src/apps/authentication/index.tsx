import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Authentication = withSuspense(lazy(() => import('./Authentication')));

export default Authentication;
