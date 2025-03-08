import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ConfirmationMaodal = withSuspense(lazy(() => import('./ConfirmationModal')));
export default ConfirmationMaodal;
