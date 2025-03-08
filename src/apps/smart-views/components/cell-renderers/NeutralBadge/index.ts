import { lazy } from 'react';

import withSuspense from '@lsq/nextgen-preact/suspense';

const NeutralBadge = lazy(() => import('./NeutralBadge'));

export default withSuspense(NeutralBadge);
