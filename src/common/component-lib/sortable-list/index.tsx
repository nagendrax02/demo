import { lazy } from 'react';
import { ISortableItem } from './sortable-list.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const SortableList = withSuspense(lazy(() => import('./SortableList')));

export default SortableList;
export type { ISortableItem };
