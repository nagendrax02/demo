import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const DateTime = withSuspense(React.lazy(() => import('./DateTime')));

export default DateTime;
