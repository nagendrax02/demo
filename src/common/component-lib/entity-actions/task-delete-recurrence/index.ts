import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TaskDeleteRecurrence = withSuspense(lazy(() => import('./TaskDeleteRecurrence')));

export default TaskDeleteRecurrence;
