import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ConnectorEmail = withSuspense(lazy(() => import('./ConnectorEmail')));

export default ConnectorEmail;
