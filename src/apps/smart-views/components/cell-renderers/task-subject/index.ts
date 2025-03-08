import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TaskSubject = withSuspense(lazy(() => import('./TaskSubject')));

export default TaskSubject;
