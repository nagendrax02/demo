import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DateFilter = withSuspense(lazy(() => import('./DateFilter')));

export default DateFilter;
