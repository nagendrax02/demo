import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const GroupedMSWithoutSelectAll = withSuspense(lazy(() => import('./GroupedMSWithoutSelectAll')));

export default GroupedMSWithoutSelectAll;
