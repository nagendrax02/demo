import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const ListCreate = withSuspense(lazy(() => import('./ListCreate')));

export default ListCreate;
