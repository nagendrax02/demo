import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const PreviewModal = withSuspense(lazy(() => import('./PreviewModal')));

export default PreviewModal;
