import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const RowDetail = withSuspense(lazy(() => import('./RowDetail')));
const ExpandableRow = withSuspense(lazy(() => import('./ExpandableRow')));

export default RowDetail;
export { ExpandableRow };
