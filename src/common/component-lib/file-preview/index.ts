import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const FilePreview = withSuspense(lazy(() => import('./FilePreview')));

export default FilePreview;
export type { IPreviewData } from './file-preview.types';
