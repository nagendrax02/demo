import React from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const Product = React.lazy(() => import('./Product'));

export default withSuspense(Product);
