import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EntityImport = withSuspense(lazy(() => import('./EntityImport')));

export default EntityImport;
