import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const Link = withSuspense(React.lazy(() => import('./Link')));

export default Link;
