import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ComingSoon = withSuspense(lazy(() => import('./ComingSoon')));

export default ComingSoon;
