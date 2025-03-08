import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const LazyDatePicker = withSuspense(lazy(() => import('./DatePicker')));
const LazyDateTimePicker = withSuspense(lazy(() => import('./DateTimePicker')));
const LazyTimePicker = withSuspense(lazy(() => import('./TimePicker')));

export { LazyDateTimePicker, LazyDatePicker, LazyTimePicker };
