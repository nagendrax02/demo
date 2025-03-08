import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ViewInBrowserLinkClicked = withSuspense(lazy(() => import('./ViewInBrowserLinkClicked')));

export default ViewInBrowserLinkClicked;
