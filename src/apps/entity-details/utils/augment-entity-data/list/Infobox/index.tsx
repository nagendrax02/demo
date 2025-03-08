import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ModifiedAndCreatedOn = withSuspense(lazy(() => import('./ModifiedAndCreatedOn')));

export default ModifiedAndCreatedOn;
