import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const SaveTemplateModal = withSuspense(lazy(() => import('./SaveTemplateModal')));

export default SaveTemplateModal;
