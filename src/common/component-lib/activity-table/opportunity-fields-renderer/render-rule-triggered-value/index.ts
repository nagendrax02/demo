import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const renderRuleTriggeredValue = withSuspense(lazy(() => import('./render-rule-triggered-value')));

export default renderRuleTriggeredValue;
