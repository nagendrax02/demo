import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';

const TextArea = withSuspense(React.lazy(() => import('./TextArea')));

export default TextArea;
