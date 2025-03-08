import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import HandleOwnerOption from './HandleOwnerOption';

const ChangeOwner = withSuspense(lazy(() => import('./ChangeOwner')));

export { HandleOwnerOption };
export default ChangeOwner;
