import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const MarkTask = withSuspense(lazy(() => import('./MarkTask')));

export default MarkTask;
