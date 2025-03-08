import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import primaryHeaderStyles from './primary-header/primary-header.module.css';

const PrimaryHeader = withSuspense(lazy(() => import('./primary-header')));
const SearchAndFilter = withSuspense(lazy(() => import('./search-filter')));
const HeaderActions = withSuspense(lazy(() => import('./header-actions')));

export { PrimaryHeader, SearchAndFilter, HeaderActions, primaryHeaderStyles };
