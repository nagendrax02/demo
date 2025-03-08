import ErrorPage from './ErrorPage';
import ConnectionError from './pages/ConnectionError';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const TeamNotified = withSuspense(lazy(() => import('./pages/TeamNotified')));
const UnexpectedError = withSuspense(lazy(() => import('./pages/UnexpectedError')));
const AccessDenied = withSuspense(lazy(() => import('./pages/AccessDenied')));
const NoMatchingRecords = withSuspense(lazy(() => import('./pages/NoMatchingResults')));
const EmptyRecords = withSuspense(lazy(() => import('./pages/EmptyRecords')));
const CacheError = withSuspense(lazy(() => import('./pages/CacheError')));

export default ErrorPage;
export {
  TeamNotified,
  UnexpectedError,
  ConnectionError,
  AccessDenied,
  NoMatchingRecords,
  EmptyRecords,
  CacheError
};
