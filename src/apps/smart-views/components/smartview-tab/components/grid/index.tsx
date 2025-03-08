import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const SmartviewsGrid = withSuspense(lazy(() => import('./SmartviewsGrid')));

export default SmartviewsGrid;
