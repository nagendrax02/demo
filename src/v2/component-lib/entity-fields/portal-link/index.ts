import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const PortalLink = withSuspense(React.lazy(() => import('./PortalLink')));

export default PortalLink;
