import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const AutomationText = withSuspense(lazy(() => import('./AutomationText')));

export default AutomationText;
