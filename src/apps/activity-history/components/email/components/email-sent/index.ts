import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EmailSent = withSuspense(lazy(() => import('./EmailSent')));

export default EmailSent;
