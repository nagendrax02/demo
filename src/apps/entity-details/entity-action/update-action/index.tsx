import React from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const Update = withSuspense(React.lazy(() => import('./Update')));

export default Update;
