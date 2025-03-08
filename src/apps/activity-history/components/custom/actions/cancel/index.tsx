import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Cancel = withSuspense(lazy(() => import('./Cancel')));

export default Cancel;
