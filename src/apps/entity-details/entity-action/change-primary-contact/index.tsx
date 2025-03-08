import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ChangePrimaryContact = withSuspense(lazy(() => import('./ChangePrimaryContact')));

export default ChangePrimaryContact;
