import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const EntityExport = withSuspense(React.lazy(() => import('./EntityExport')));

export default EntityExport;
