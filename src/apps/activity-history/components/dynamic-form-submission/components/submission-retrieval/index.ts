import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const SubmissionRetrieval = withSuspense(lazy(() => import('./SubmissionRetrieval')));

export default SubmissionRetrieval;
