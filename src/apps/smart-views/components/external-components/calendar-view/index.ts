import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const CalendarView = withSuspense(lazy(() => import('./CalendarView')));

export default CalendarView;
