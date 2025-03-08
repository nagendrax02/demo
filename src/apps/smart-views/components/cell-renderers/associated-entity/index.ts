import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AssociatedEntity = lazy(() => import('./AssociatedEntity'));

export default withSuspense(AssociatedEntity);
