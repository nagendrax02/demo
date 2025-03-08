import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
const ErrorRenderer = withSuspense(lazy(() => import('./ErrorRenderer')));

export default ErrorRenderer;
