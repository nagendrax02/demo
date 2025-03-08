import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Payment = withSuspense(lazy(() => import('./Payment')));

export default Payment;
