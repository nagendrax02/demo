import { StorageKey, getItem } from 'common/utils/storage-manager';
import Spinner from '@lsq/nextgen-preact/spinner';
import styles from './router.module.css';
import { Sandbox } from '../sandbox';
import { APP_ROUTE } from 'common/constants';
import React from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { EntityType } from 'common/types';
import SmartViews from 'apps/smart-views';
import ErrorBoundary from 'common/component-lib/error-boundary';
import {
  getErrorBoundaryExperienceModule,
  isMiP,
  updateAppVisibilityState
} from 'common/utils/helpers/helpers';
import ManageLeadTab from 'apps/smart-views/components/custom-tabs/manage-lead-tab';
import Dashboard from 'apps/dashboard';
import Settings from 'apps/settings';
import FeatureRestriction from 'common/utils/feature-restriction';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';
import AccessDenied from 'common/component-lib/file-library/components/access-denied';
import { LoadExternalIFrame } from 'apps/external-app/components';
import ComingSoon from 'apps/coming-soon';
import ManageTasks from 'apps/smart-views/components/custom-tabs/manage-tasks';
import { ExperienceType, getExperienceKey, startExperience } from 'common/utils/experience';
import Casa from 'apps/dashboard/casa';
import ManageListsTab from 'apps/smart-views/components/custom-tabs/manage-lists';
import ManageActivity from 'apps/smart-views/components/custom-tabs/manage-activity-tab';
import ManageListLeadDetail from 'apps/smart-views/components/custom-tabs/manage-list-lead-detail';

const EntityDetails = withSuspense(React.lazy(() => import('apps/entity-details')));
const AccessDeniedV2 = withSuspense(
  React.lazy(() => import('common/component-lib/error-page/pages/AccessDenied'))
);

const getSandBox = (): JSX.Element => {
  const enableSandbox = getItem(StorageKey.EnableSandbox) || false;
  if (enableSandbox) {
    return (
      <Sandbox suspenseFallback={<Spinner customStyleClass={styles.center_spinner_container} />} />
    );
  }
  return <>Sandbox Disabled</>;
};

const getEntityDetails = (entityType: EntityType, query: string, path?: string): JSX.Element => {
  if (!isMiP()) {
    //Update visibility state of page
    updateAppVisibilityState(false);
    const experienceConfig = getExperienceKey();
    startExperience({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      key: experienceConfig.key
    });
  }

  return (
    <ErrorBoundary
      module={getErrorBoundaryExperienceModule(entityType || EntityType.Lead)}
      key={getErrorBoundaryExperienceModule(entityType || EntityType.Lead)}>
      <EntityDetails
        key={query}
        queryParams={`${path ?? ''}${query}`}
        type={entityType ? entityType : EntityType.Lead}
        suspenseFallback={<Spinner customStyleClass={styles.center_spinner_container} />}
      />
    </ErrorBoundary>
  );
};

const getSmartViews = (): JSX.Element => {
  if (!isMiP()) {
    updateAppVisibilityState(false);
    const experienceConfig = getExperienceKey();
    startExperience({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      key: experienceConfig.key
    });
  }
  return (
    <ErrorBoundary module={'SmartViews'} key={'SmartViews'}>
      <FeatureRestriction
        moduleName={FeatureRestrictionModuleTypes.SmartViews}
        actionName={FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].View}
        callerSource={CallerSource.Router}
        placeholderElement={<Spinner customStyleClass={styles.center_spinner_container} />}
        fallbackElement={<AccessDeniedV2 variant="empty" />}>
        <SmartViews
          suspenseFallback={<Spinner customStyleClass={styles.center_spinner_container} />}
        />
      </FeatureRestriction>
    </ErrorBoundary>
  );
};

const getManageLeads = (query?: string): JSX.Element => {
  return (
    <ErrorBoundary module={'ManageLeads'} key={'ManageLeads'}>
      <FeatureRestriction
        moduleName={FeatureRestrictionModuleTypes.ManageLeads}
        actionName={FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].View}
        callerSource={CallerSource.Router}
        placeholderElement={<Spinner customStyleClass={styles.center_spinner_container} />}
        fallbackElement={<AccessDeniedV2 variant="empty" />}>
        <ManageLeadTab
          key={query}
          suspenseFallback={<Spinner customStyleClass={styles.center_spinner_container} />}
        />
      </FeatureRestriction>
    </ErrorBoundary>
  );
};

const getCasaWeb = (): JSX.Element => {
  return (
    <ErrorBoundary module={'CasaWeb'} key={'CasaWeb'}>
      <Casa />
    </ErrorBoundary>
  );
};

const getManageTasks = (): JSX.Element => {
  return (
    <ErrorBoundary module={'ManageTasks'} key={'ManageTasks'}>
      <FeatureRestriction
        moduleName={FeatureRestrictionModuleTypes.ManageTasks}
        actionName={FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageTasks].View}
        callerSource={CallerSource.Router}
        placeholderElement={<Spinner customStyleClass={styles.center_spinner_container} />}
        fallbackElement={<AccessDeniedV2 variant="empty" />}>
        <ManageTasks
          suspenseFallback={<Spinner customStyleClass={styles.center_spinner_container} />}
        />
      </FeatureRestriction>
    </ErrorBoundary>
  );
};

const getManageActivities = (): JSX.Element => {
  return (
    <ErrorBoundary module={'ManageActivities'} key={'ManageActivities'}>
      <FeatureRestriction
        moduleName={FeatureRestrictionModuleTypes.ManageActivities}
        actionName={
          FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageActivities].View
        }
        callerSource={CallerSource.Router}
        placeholderElement={<Spinner customStyleClass={styles.center_spinner_container} />}
        fallbackElement={<AccessDeniedV2 variant="empty" />}>
        <ManageActivity
          suspenseFallback={<Spinner customStyleClass={styles.center_spinner_container} />}
        />
      </FeatureRestriction>
    </ErrorBoundary>
  );
};

const getDashboard = (): JSX.Element => {
  return (
    <ErrorBoundary module={'Dashboard'} key={'Dashboard'}>
      <FeatureRestriction
        actionName={FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.Dashboard].View}
        moduleName={FeatureRestrictionModuleTypes.Dashboard}
        callerSource={CallerSource.Router}
        placeholderElement={<Spinner customStyleClass={styles.center_spinner_container} />}
        fallbackElement={<AccessDenied />}>
        <Dashboard />
      </FeatureRestriction>
    </ErrorBoundary>
  );
};

const getSettings = (): JSX.Element => {
  return (
    <ErrorBoundary module={'Settings'} key={'Settings'}>
      <Settings />
    </ErrorBoundary>
  );
};

const getExternalApp = (): JSX.Element => {
  return (
    <ErrorBoundary module={'ExternalApp'} key={'ExternalApp'}>
      <LoadExternalIFrame />
    </ErrorBoundary>
  );
};

const getComingSoon = (): JSX.Element => {
  return (
    <ErrorBoundary module={'ComingSoon'} key={'ComingSoon'}>
      <ComingSoon />
    </ErrorBoundary>
  );
};

const getListDetails = (query?: string): JSX.Element => {
  return (
    <ErrorBoundary module={'ListDetails'} key={'ListDetails'}>
      <FeatureRestriction
        moduleName={FeatureRestrictionModuleTypes.ManageLists}
        actionName={FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLists].View}
        callerSource={CallerSource.Router}
        placeholderElement={<Spinner customStyleClass={styles.center_spinner_container} />}
        fallbackElement={<AccessDeniedV2 variant="empty" />}>
        <ManageListLeadDetail
          key={query}
          suspenseFallback={<Spinner customStyleClass={styles.center_spinner_container} />}
        />
      </FeatureRestriction>
    </ErrorBoundary>
  );
};

const getManageLists = (query?: string): JSX.Element => {
  return (
    <ErrorBoundary module={'ManageLists'} key={'ManageLists'}>
      <FeatureRestriction
        moduleName={FeatureRestrictionModuleTypes.ManageLists}
        actionName={FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLists].View}
        callerSource={CallerSource.Router}
        placeholderElement={<Spinner customStyleClass={styles.center_spinner_container} />}
        fallbackElement={<AccessDeniedV2 variant="empty" />}>
        <ManageListsTab
          key={query}
          suspenseFallback={<Spinner customStyleClass={styles.center_spinner_container} />}
        />
      </FeatureRestriction>
    </ErrorBoundary>
  );
};

export const routerConfig: Record<string, (query: string, path: string) => JSX.Element> = {
  [APP_ROUTE.sandbox]: () => getSandBox(),
  [APP_ROUTE.mipPerfDebug]: (query) => getEntityDetails(EntityType.Lead, query),
  [APP_ROUTE.platformLD]: (query) => getEntityDetails(EntityType.Lead, query),
  [APP_ROUTE.leadDetails]: (query) => getEntityDetails(EntityType.Lead, query),
  [APP_ROUTE.opportunityDetails]: (query) => getEntityDetails(EntityType.Opportunity, query),
  [APP_ROUTE.platformOpportunityDetails]: (query) =>
    getEntityDetails(EntityType.Opportunity, query),
  [APP_ROUTE.platformSV]: () => getSmartViews(),
  [APP_ROUTE.smartviews]: () => getSmartViews(),
  [APP_ROUTE.search]: (query) => getManageLeads(query),
  [APP_ROUTE.accountDetails]: (query, path) => getEntityDetails(EntityType.Account, query, path),
  [APP_ROUTE.accountmanagement]: (query, path) => getEntityDetails(EntityType.Account, query, path),
  [APP_ROUTE.dashboard]: () => getDashboard(),
  [APP_ROUTE.settings]: () => getSettings(),
  [APP_ROUTE.default]: () => <Spinner customStyleClass={styles.center_spinner_container} />,
  [APP_ROUTE.casa]: () => getCasaWeb(),
  [APP_ROUTE.externalApp]: () => getExternalApp(),
  [APP_ROUTE.platformManageTasks]: () => getManageTasks(),
  [APP_ROUTE.comingSoon]: () => getComingSoon(),
  [APP_ROUTE.platformManageLeads]: () => getManageLeads(),
  [APP_ROUTE.platformManageLeadsIndex]: () => getManageLeads(),
  [APP_ROUTE.platformDashboard]: () => getDashboard(),
  [APP_ROUTE.platformManageLists]: () => getManageLists(),
  [APP_ROUTE.platformManageListsIndex]: () => getManageLists(),
  [APP_ROUTE.platformManageActivities]: () => getManageActivities(),
  [APP_ROUTE.listDetails]: (query) => getListDetails(query)
};
