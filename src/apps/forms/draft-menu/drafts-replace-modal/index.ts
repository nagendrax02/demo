import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DraftReplaceModal = withSuspense(lazy(() => import('./DraftReplaceModal')));

export default DraftReplaceModal;
