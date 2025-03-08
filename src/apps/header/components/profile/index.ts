import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Profile = withSuspense(lazy(() => import('./Profile')));

export default Profile;
