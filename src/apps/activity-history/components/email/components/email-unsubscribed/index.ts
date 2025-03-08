import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EmailUnsubscribed = withSuspense(lazy(() => import('./EmailUnsubscribed')));

export default EmailUnsubscribed;
