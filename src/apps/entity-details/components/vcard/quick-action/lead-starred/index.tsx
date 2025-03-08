import withSuspense from '@lsq/nextgen-preact/suspense';

import React from 'react';
const LeadStarred = React.lazy(() => import('./LeadStarred'));

export default withSuspense(LeadStarred);
