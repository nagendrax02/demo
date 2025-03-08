import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ChangeStage = withSuspense(lazy(() => import('./ChangeStage')));

export default ChangeStage;
