import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EmailMarkAsSpam = withSuspense(lazy(() => import('./EmailMarkAsSpam')));

export default EmailMarkAsSpam;
