import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const Boolean = withSuspense(React.lazy(() => import('./Boolean')));

export default Boolean;
