import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Subject = withSuspense(lazy(() => import('./Subject')));

export default Subject;
