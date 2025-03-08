import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const ScheduleEmail = withSuspense(lazy(() => import('./ScheduleEmail')));

export default ScheduleEmail;
