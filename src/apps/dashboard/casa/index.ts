import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Casa = withSuspense(lazy(() => import('./Casa')));

export default Casa;
