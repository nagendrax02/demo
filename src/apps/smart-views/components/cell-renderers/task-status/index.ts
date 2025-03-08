import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TaskStatus = lazy(() => import('./TaskStatus'));

export default withSuspense(TaskStatus);
