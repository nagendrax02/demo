import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const DragDropModal = withSuspense(lazy(() => import('./DragDropModal')));

export default DragDropModal;
