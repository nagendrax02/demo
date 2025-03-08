import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Link = withSuspense(lazy(() => import('./Link')));

export default Link;
