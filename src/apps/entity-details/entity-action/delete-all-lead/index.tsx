import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const DeleteAllLead = withSuspense(React.lazy(() => import('./DeleteAllLead')));

export default DeleteAllLead;
