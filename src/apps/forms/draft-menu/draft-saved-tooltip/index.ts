import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DraftSavedTooltip = withSuspense(lazy(() => import('./DraftSavedTooltip')));

export default DraftSavedTooltip;
