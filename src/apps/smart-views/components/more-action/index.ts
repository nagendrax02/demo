import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const ActionIcon = withSuspense(lazy(() => import('./ActionIcon')));

export default ActionIcon;
