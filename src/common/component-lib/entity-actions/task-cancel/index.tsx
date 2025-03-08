import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TaskDelete = withSuspense(lazy(() => import('./TaskCancel')));

export default TaskDelete;
