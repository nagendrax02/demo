import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const SubmissionStatusIcon = withSuspense(lazy(() => import('./SubmissionStatusIcon')));

export default SubmissionStatusIcon;
