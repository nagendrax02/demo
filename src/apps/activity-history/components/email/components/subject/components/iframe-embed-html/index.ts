import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const IframeEmbedHtml = withSuspense(lazy(() => import('./IframeEmbedHtml')));

export default IframeEmbedHtml;
