import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const OppStatusHighlighted = withSuspense(lazy(() => import('./OppStatusHighlighted')));

export default OppStatusHighlighted;
