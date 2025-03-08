import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const CapturedFromIcon = withSuspense(lazy(() => import('./CapturedFromIcon')));

export default CapturedFromIcon;
