import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const DateTime = withSuspense(lazy(() => import('./DateTime')));

export default DateTime;
