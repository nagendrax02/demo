import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ActionWrapper = withSuspense(lazy(() => import('./ActionWrapper')));

export { ActionWrapper };

export type { IActionWrapperItem } from './action-wrapper.types';
