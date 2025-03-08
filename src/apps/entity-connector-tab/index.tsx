import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ConnectorTab = withSuspense(lazy(() => import('./EntityConnectorTab')));

export default ConnectorTab;
