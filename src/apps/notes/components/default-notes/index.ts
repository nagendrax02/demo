import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const DefaultNotesPage = withSuspense(lazy(() => import('./DefaultNotesPage')));

export default DefaultNotesPage;
