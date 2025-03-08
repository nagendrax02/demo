import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EmailResponse = withSuspense(lazy(() => import('./EmailResponse')));

export default EmailResponse;
