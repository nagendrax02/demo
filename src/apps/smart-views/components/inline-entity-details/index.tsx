import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const InlineEntityDetails = withSuspense(lazy(() => import('./InlineEntityDetails')));

export default InlineEntityDetails;
