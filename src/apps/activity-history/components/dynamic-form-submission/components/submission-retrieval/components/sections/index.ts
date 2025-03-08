import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Sections = withSuspense(lazy(() => import('./Sections')));

export default Sections;
