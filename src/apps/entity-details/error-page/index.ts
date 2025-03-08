import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ErrorPage = withSuspense(lazy(() => import('./ErrorPage')));

export default ErrorPage;
