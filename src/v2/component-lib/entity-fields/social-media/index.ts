import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const SocialMedia = withSuspense(React.lazy(() => import('./SocialMedia')));

export default SocialMedia;
