import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Popup = withSuspense(lazy(() => import('./Popup')));

export default Popup;
