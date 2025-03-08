import { lazy } from 'react';
import { IOtherOption } from './other.types';
import { OTHER_VALUE_KEY } from './constant';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DropdownWithOthers = withSuspense(lazy(() => import('./DropdownWithOthers')));

export default DropdownWithOthers;
export { OTHER_VALUE_KEY };
export type { IOtherOption };
