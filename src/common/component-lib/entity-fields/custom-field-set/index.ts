import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const CustomFieldSet = withSuspense(lazy(() => import('./CustomFieldSet')));

export default CustomFieldSet;
