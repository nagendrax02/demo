import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const UserCheckInConfirmationPopup = withSuspense(
  lazy(() => import('./UserCheckInConfirmationPopup'))
);

export default UserCheckInConfirmationPopup;
