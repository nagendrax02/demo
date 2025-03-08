import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const GroupedOptionDropdown = withSuspense(lazy(() => import('./GroupedOptionDropdown')));

export default GroupedOptionDropdown;
export type {
  IGroupConfig,
  IGroupedOption,
  GroupConfig,
  AugmentedGroupedOption
} from './grouped-option-dropdown.types';
