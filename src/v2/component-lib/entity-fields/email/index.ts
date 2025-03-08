import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const Email = withSuspense(React.lazy(() => import('./Email')));

export default Email;
