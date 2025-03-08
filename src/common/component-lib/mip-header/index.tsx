import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const MiPHeader = withSuspense(lazy(() => import('./MiPHeader')));

export { Module } from './mip-header.types';
export { setMiPHeaderModule } from './mip-header.store';

export default MiPHeader;
