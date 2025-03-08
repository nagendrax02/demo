import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ActivityEventNote = withSuspense(lazy(() => import('./ActivityEventNote')));

export default ActivityEventNote;
