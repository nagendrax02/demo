import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DynamicFormActivity = withSuspense(lazy(() => import('./dynamic-form-activity')));

export { DynamicFormActivity };
