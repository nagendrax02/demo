import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DraftSideBarModal = withSuspense(lazy(() => import('./DraftSideBarModal')));

export default DraftSideBarModal;
