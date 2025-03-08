import React from 'react';
import { getUserNames } from './utils';
import withSuspense from '@lsq/nextgen-preact/suspense';
const UserName = React.lazy(() => import('./UserName'));

export default withSuspense(UserName);
export { getUserNames };
