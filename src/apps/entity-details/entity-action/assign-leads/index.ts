import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AssignLeads = withSuspense(lazy(() => import('./AssignLeads')));

export default AssignLeads;
