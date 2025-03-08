import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const QuickFilter = withSuspense(lazy(() => import('./QuickFilter')));

export default QuickFilter;
