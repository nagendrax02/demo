import React from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const OptOut = withSuspense(React.lazy(() => import('./OptOut')));

export default OptOut;
