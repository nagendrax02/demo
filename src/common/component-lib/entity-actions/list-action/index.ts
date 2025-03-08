import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ListAction = withSuspense(lazy(() => import('./ListAction')));

export default ListAction;
