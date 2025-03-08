import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DraftCardContent = withSuspense(lazy(() => import('./DraftCardContent')));

export default DraftCardContent;
