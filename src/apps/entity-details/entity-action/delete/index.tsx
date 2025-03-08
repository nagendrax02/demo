import React from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const Delete = withSuspense(React.lazy(() => import('./Delete')));

export default Delete;
