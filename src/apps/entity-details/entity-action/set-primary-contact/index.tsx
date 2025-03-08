import React from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const SetPrimaryContact = withSuspense(React.lazy(() => import('./SetPrimaryContact')));

export default SetPrimaryContact;
