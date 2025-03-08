import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EmailAttachment = withSuspense(lazy(() => import('./EmailAttachment')));

export default EmailAttachment;
