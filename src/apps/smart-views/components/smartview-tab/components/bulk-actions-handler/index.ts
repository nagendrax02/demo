import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const BulkActionHandler = withSuspense(lazy(() => import('./BulkActionHandler')));

export default BulkActionHandler;
