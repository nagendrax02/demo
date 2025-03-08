import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import AddNewFolder from './add-new-folder';

const Folder = withSuspense(lazy(() => import('./Folder')));

export default Folder;
export { AddNewFolder };
