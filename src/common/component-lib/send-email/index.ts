import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const SendEmail = withSuspense(lazy(() => import('./SendEmail')));

export default SendEmail;

import ScheduleEmail from './schedule-email';

export { ScheduleEmail };
