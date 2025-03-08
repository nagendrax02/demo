import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const EditQuickFilter = withSuspense(lazy(() => import('./EditQuickFilter')));

export default EditQuickFilter;
