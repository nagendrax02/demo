import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DraftCard = withSuspense(lazy(() => import('./DraftCard')));

export default DraftCard;
