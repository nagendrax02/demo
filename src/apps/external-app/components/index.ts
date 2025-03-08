import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ExternalAppLoader = withSuspense(lazy(() => import('./ExternalAppLoader')));
const ExternalAppWithSubMenu = withSuspense(lazy(() => import('./ExternalAppWithSubMenu')));
const LoadExternalIFrame = withSuspense(lazy(() => import('./LoadExternalIFrame')));

export { ExternalAppLoader, ExternalAppWithSubMenu, LoadExternalIFrame };
