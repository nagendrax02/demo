import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ProspectActivityCell = withSuspense(lazy(() => import('./ProspectActivityCell')));
export default ProspectActivityCell;
