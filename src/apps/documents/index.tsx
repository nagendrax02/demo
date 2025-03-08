import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Documents = withSuspense(lazy(() => import('./Documents')));

export default Documents;
