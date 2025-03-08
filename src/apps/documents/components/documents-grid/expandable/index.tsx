import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Expandable = withSuspense(lazy(() => import('./Expandable')));

export default Expandable;
