import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TaskActions = withSuspense(lazy(() => import('./TaskActions')));

export default TaskActions;
