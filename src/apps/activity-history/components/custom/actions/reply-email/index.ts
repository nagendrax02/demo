import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const ReplyEmail = withSuspense(lazy(() => import('./ReplyEmail')));

export default ReplyEmail;
