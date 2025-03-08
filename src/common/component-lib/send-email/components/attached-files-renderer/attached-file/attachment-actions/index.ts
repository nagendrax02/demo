import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AttachmentActions = withSuspense(lazy(() => import('./AttachmentActions')));

export default AttachmentActions;
