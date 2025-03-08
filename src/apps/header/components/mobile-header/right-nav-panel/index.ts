import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const RightNavPanel = withSuspense(lazy(() => import('./RightNavPanel')));

export default RightNavPanel;
