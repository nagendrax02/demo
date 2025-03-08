import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const SearchableSingleSelect = withSuspense(lazy(() => import('./SearchableSingleSelect')));

export default SearchableSingleSelect;
