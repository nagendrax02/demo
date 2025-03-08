import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const LocationInsightsIcon = withSuspense(lazy(() => import('./LocationInsightsIcon')));
const JourneysIcon = withSuspense(lazy(() => import('./JourneysIcon')));
const TerritoriesIcon = withSuspense(lazy(() => import('./TerritoriesIcon')));

export { LocationInsightsIcon, JourneysIcon, TerritoriesIcon };
