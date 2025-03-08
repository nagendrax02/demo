import withSuspense from '@lsq/nextgen-preact/suspense';
import React from 'react';
const BasicEditor = withSuspense(React.lazy(() => import('./basic-editor')));
const AdvancedEditor = withSuspense(React.lazy(() => import('./advanced-editor')));

export { BasicEditor, AdvancedEditor };
