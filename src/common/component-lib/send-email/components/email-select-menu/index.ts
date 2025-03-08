import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const EmailSelectMenu = withSuspense(lazy(() => import('./EmailSelectMenu')));

export default EmailSelectMenu;
