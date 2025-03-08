import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TextAdvanced = withSuspense(lazy(() => import('./TextAdvanced')));

export default TextAdvanced;
