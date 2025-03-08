import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
const IFrame = withSuspense(lazy(() => import('./IFrame')));

export default IFrame;
