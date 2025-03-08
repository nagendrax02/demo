import React from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const AssociatedLeadDropdown = React.lazy(() => import('./AssociatedLeadDropdown'));

export default withSuspense(AssociatedLeadDropdown);
