import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ActivityScore = withSuspense(lazy(() => import('./ActivityScore')));

export default ActivityScore;
