import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dashboard = withSuspense(lazy(() => import('./Dashboard')));

export default Dashboard;
