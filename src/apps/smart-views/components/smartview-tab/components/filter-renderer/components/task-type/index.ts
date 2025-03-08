import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TaskTypeDropdown = withSuspense(lazy(() => import('./TaskTypeDropdown')));

export default TaskTypeDropdown;
