import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const SuccessMessage = withSuspense(lazy(() => import('./SuccessMessage')));

export default SuccessMessage;
