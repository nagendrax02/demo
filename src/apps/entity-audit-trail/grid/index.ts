import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Grid = withSuspense(lazy(() => import('./Grid')));

export default Grid;
