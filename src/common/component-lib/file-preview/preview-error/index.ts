import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
const PreviewError = withSuspense(lazy(() => import('./PreviewError')));

export default PreviewError;
