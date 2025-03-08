import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const Table = withSuspense(lazy(() => import('./Table')));

export default Table;
