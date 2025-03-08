import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Attachment = withSuspense(lazy(() => import('./Attachment')));

export default Attachment;
