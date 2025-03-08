import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EmailLinkClicked = withSuspense(lazy(() => import('./EmailLinkClicked')));

export default EmailLinkClicked;
