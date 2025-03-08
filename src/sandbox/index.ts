import React from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const Sandbox = withSuspense(React.lazy(() => import('./Sandbox')));

export { Sandbox };
