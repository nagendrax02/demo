import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EmailUnsubscribedLinkClicked = withSuspense(
  lazy(() => import('./EmailUnsubscribedLinkClicked'))
);

export default EmailUnsubscribedLinkClicked;
