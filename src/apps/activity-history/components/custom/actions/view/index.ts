import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const View = withSuspense(lazy(() => import('./View')));

export default View;
