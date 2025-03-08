import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TypeFilter = withSuspense(lazy(() => import('./TypeFilter')));

export default TypeFilter;
