import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EmailBounced = withSuspense(lazy(() => import('./EmailBounced')));

export default EmailBounced;
