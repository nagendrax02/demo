import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const Phone = withSuspense(React.lazy(() => import('./Phone')));

export default Phone;
