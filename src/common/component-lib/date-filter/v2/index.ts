import { lazy } from 'react';
import { IDateOption } from '../date-filter.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DateFilter = withSuspense(lazy(() => import('./DateFilter')));

export default DateFilter;
export type { IDateOption };
