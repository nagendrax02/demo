import { lazy } from 'react';
import Body from './Body';
import Primary from './Primary';
import Secondary from './Secondary';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Footer = withSuspense(lazy(() => import('./Footer')));
const Tertiary = withSuspense(lazy(() => import('./Tertiary')));

export { Primary, Secondary, Tertiary, Body, Footer };
