import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ChangeStatusStage = withSuspense(lazy(() => import('./ChangeStatusStage')));

export default ChangeStatusStage;
