import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ControlledTooltip = withSuspense(lazy(() => import('./ControlledTooltip')));

export default ControlledTooltip;
