import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const ListDetailsActionsRenderer = withSuspense(lazy(() => import('./ListDetailsActionsRenderer')));

export default ListDetailsActionsRenderer;
