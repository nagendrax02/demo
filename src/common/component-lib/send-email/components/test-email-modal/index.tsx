import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TestEmailModal = withSuspense(lazy(() => import('./TestEmailModal')));

export default TestEmailModal;
