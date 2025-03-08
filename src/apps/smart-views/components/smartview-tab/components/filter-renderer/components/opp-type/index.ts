import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const OppTypeDropdown = withSuspense(lazy(() => import('./OppTypeDropdown')));

export default OppTypeDropdown;
