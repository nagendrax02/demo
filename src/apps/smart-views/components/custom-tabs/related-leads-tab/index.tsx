import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const RelatedLeadsTab = withSuspense(lazy(() => import('./RelatedLeadsTab')));

export default RelatedLeadsTab;
