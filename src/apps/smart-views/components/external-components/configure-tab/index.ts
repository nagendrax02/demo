import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ConfigureTab = withSuspense(lazy(() => import('./ConfigureTab')));

export default ConfigureTab;
