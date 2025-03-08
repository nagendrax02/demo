import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EntityAuditTrail = withSuspense(lazy(() => import('./EntityAuditTrail')));

export default EntityAuditTrail;
