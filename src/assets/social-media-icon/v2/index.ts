import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const FacebookIcon = withSuspense(lazy(() => import('./FacebookIcon')));
const GoogleIcon = withSuspense(lazy(() => import('./GoogleIcon')));
const InstagramIcon = withSuspense(lazy(() => import('./InstagramLogo')));
const MetaIcon = withSuspense(lazy(() => import('./MetaIcon')));
const GooglePlus = withSuspense(lazy(() => import('./GooglePlus')));
const LinkedIn = withSuspense(lazy(() => import('./LinkedIn')));
const Skype = withSuspense(lazy(() => import('./Skype')));
const Twitter = withSuspense(lazy(() => import('./Twitter')));

export { FacebookIcon, GoogleIcon, InstagramIcon, MetaIcon, GooglePlus, LinkedIn, Skype, Twitter };
