import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AutomationReport = withSuspense(lazy(() => import('./AutomationReport')));

export default AutomationReport;
