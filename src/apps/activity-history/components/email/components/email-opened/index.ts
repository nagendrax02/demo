import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EmailOpened = withSuspense(lazy(() => import('./EmailOpened')));

export default EmailOpened;
