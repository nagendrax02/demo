import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const MultiSelect = withSuspense(React.lazy(() => import('./MultiSelect')));

export default MultiSelect;
