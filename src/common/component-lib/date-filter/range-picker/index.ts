import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const RangePicker = lazy(() => import('./RangePicker'));

export default withSuspense(RangePicker);
