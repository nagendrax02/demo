import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

import { IAssociatedAccountOption } from './associated-account-dropdown/associated-account.types';

const AssociatedEntity = withSuspense(lazy(() => import('./associated-entity/AssociatedEntity')));
const AssociatedAccount = withSuspense(
  lazy(() => import('./associated-account-dropdown/AssociatedAccount'))
);

export { AssociatedEntity, AssociatedAccount };
export type { IAssociatedAccountOption };
