import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const PdfPreviewer = withSuspense(lazy(() => import('./PdfPreviewer')));
export default PdfPreviewer;
