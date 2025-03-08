import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('./Button')));

export default Button;
