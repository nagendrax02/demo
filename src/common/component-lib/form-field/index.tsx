import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const FormField = withSuspense(lazy(() => import('./FormField')));

export default FormField;
