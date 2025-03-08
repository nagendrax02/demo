import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const SourceChange = withSuspense(lazy(() => import('./SourceChange')));

export default SourceChange;
