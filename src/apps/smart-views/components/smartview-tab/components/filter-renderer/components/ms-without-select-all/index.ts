import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const MSWithoutSelectAll = withSuspense(lazy(() => import('./MSWithoutSelectAll')));

export default MSWithoutSelectAll;
