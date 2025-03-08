import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Content = withSuspense(lazy(() => import('./Content')));

export default Content;
