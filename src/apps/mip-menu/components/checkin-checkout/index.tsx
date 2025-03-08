import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const CheckinCheckout = withSuspense(lazy(() => import('./CheckinCheckout')));
const CheckinModal = withSuspense(lazy(() => import('./CheckinModal')));
const CheckOutModal = withSuspense(lazy(() => import('./CheckoutModal')));
const AvailablePhones = withSuspense(lazy(() => import('./AssociatedPhones')));

export { CheckinModal, CheckOutModal, AvailablePhones };
export default CheckinCheckout;
