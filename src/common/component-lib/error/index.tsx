import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Error = withSuspense(lazy(() => import('./Error')));

export default Error;
