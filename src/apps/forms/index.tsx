import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const Forms = withSuspense(lazy(() => import('./Forms')));

export default Forms;
