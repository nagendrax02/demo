import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Associated = withSuspense(lazy(() => import('./Associated')));

export default Associated;
