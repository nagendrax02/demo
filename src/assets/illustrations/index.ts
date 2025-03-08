import withSuspense from '@lsq/nextgen-preact/suspense';
import DogPullingPlug from './DogPullingPlug';
import { lazy } from 'react';

const ErrorInClouds = withSuspense(lazy(() => import('./ErrorInClouds')));
const Ufo404 = withSuspense(lazy(() => import('./Ufo404')));
const LockedFile = withSuspense(lazy(() => import('./LockedFile')));
const EmptyDrawer = withSuspense(lazy(() => import('./EmptyDrawer')));
const EmptyBox = withSuspense(lazy(() => import('./EmptyBox')));
const BrowserWindowError = withSuspense(lazy(() => import('./BrowserWindowError')));

export {
  ErrorInClouds,
  Ufo404,
  DogPullingPlug,
  LockedFile,
  EmptyDrawer,
  EmptyBox,
  BrowserWindowError
};
