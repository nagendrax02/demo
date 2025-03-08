import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Ace = withSuspense(lazy(() => import('./Ace')));
const AppsAndConnectors = withSuspense(lazy(() => import('./AppsAndConnectors')));
const Casa = withSuspense(lazy(() => import('./Casa')));
const ContentLibrary = withSuspense(lazy(() => import('./ContentLibrary')));
const FieldSales = withSuspense(lazy(() => import('./FieldSales')));
const IntegrationCloud = withSuspense(lazy(() => import('./IntegrationCloud')));
const Journeys = withSuspense(lazy(() => import('./Journeys')));
const LeadsHub = withSuspense(lazy(() => import('./LeadsHub')));
const Marketing = withSuspense(lazy(() => import('./Marketing')));
const TicketManagement = withSuspense(lazy(() => import('./TicketManagement')));
const Workflow = withSuspense(lazy(() => import('./Workflow')));

export {
  Ace,
  AppsAndConnectors,
  Casa,
  ContentLibrary,
  FieldSales,
  IntegrationCloud,
  Journeys,
  LeadsHub,
  Marketing,
  TicketManagement,
  Workflow
};
