import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ScheduleEmailModal = withSuspense(lazy(() => import('./ScheduleEmailModal')));

export default ScheduleEmailModal;
