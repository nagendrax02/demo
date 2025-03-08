import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
const File = withSuspense(lazy(() => import('./File')));
const ActivityFile = lazy(() => import('./ActivityFile'));

export { ActivityFile };
export default File;
