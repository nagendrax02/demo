import { lazy } from 'react';
import { TAB_ID } from '../constants/tab-id';
import { EntityType } from '../../../types';
import Documents from 'apps/documents';
import Notes from 'apps/notes';
import Tasks from 'apps/tasks';
import LeadShareHistory from 'apps/lead-share-history';
import { IEntityIds, IEntityRepNames } from 'apps/entity-details/types/entity-store.types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { RelatedLeadsTab, SalesActivityTab } from 'apps/smart-views/components/custom-tabs';
import LeadOpportunityTab from 'apps/smart-views/components/custom-tabs/lead-opportunity-tab/LeadOpportunityTab';
import EntityAuditTrail from 'apps/entity-audit-trail';
import withSuspense from '@lsq/nextgen-preact/suspense';

const EntityAttributeDetails = withSuspense(lazy(() => import('apps/entity-attribute-details')));
const ActivityHistoryRoot = withSuspense(lazy(() => import('apps/activity-history')));

const getEntityAttributeDetails = (
  tabId: string,
  coreData: IEntityDetailsCoreData
): JSX.Element => {
  return (
    <div data-testid="system-tab">
      <EntityAttributeDetails tabId={tabId} entityDetailsCoreData={coreData} />
    </div>
  );
};

const getActivityHistoryRoot = ({
  entityType,
  entityDetailsType,
  entityIds,
  entityRepNames,
  eventCode,
  entityTypeRepName
}: {
  entityType: EntityType;
  entityDetailsType: EntityType;
  entityIds: IEntityIds;
  entityRepNames: IEntityRepNames;
  eventCode?: number;
  entityTypeRepName: string;
}): JSX.Element => {
  return (
    <ActivityHistoryRoot
      type={entityType}
      entityDetailsCoreData={{
        entityIds: entityIds,
        entityDetailsType,
        entityRepNames: entityRepNames,
        eventCode,
        entityTypeRepName
      }}
    />
  );
};

const getRelatedLeads = (coreData: IEntityDetailsCoreData): JSX.Element => {
  return <RelatedLeadsTab coreData={coreData} />;
};

const getSalesActivityTab = (coreData: IEntityDetailsCoreData): JSX.Element => {
  return <SalesActivityTab entityDetailsTabCoreData={coreData} />;
};

const getLeadOpportunityTab = (coreData: IEntityDetailsCoreData): JSX.Element => {
  return <LeadOpportunityTab coreData={coreData} />;
};

const getDocuments = ({
  entityType,
  entityIds,
  entityRepNames,
  entityTypeRepName
}: {
  entityType: EntityType;
  entityIds: IEntityIds;
  entityRepNames: IEntityRepNames;
  entityTypeRepName?: string;
}): JSX.Element => {
  return (
    <Documents
      getData={() => {
        return {
          entityType: entityType,
          entityIds: entityIds,
          entityRepNames: entityRepNames,
          entityTypeRepName: entityTypeRepName
        };
      }}
    />
  );
};

const getNotes = (
  entityType: EntityType,
  entityIds: IEntityIds,
  entityRepNames: IEntityRepNames
): JSX.Element => {
  return (
    <Notes
      getData={() => {
        return {
          entityIds: entityIds,
          entityRepName: entityRepNames?.[entityType],
          entityType: entityType
        };
      }}
    />
  );
};

const getTasks = ({
  tabId,
  coreData
}: {
  tabId: string;
  coreData: IEntityDetailsCoreData;
}): JSX.Element => {
  return (
    <Tasks
      tabId={tabId}
      getData={() => {
        return { coreData };
      }}
    />
  );
};

const getLeadShareHistory = (coreData: IEntityDetailsCoreData): JSX.Element => {
  return <LeadShareHistory entityDetailsCoreData={coreData} />;
};

const getEntityAuditTrailTab = (coreData: IEntityDetailsCoreData): JSX.Element => {
  return <EntityAuditTrail entityCoreData={coreData} />;
};

export const systemTabConfig: Record<string, (props: IEntityDetailsCoreData) => JSX.Element> = {
  [TAB_ID.LeadAttributeDetails]: (props) =>
    getEntityAttributeDetails(TAB_ID.LeadAttributeDetails, props),

  [TAB_ID.ActivityDetails]: (props) => getEntityAttributeDetails(TAB_ID.ActivityDetails, props),

  [TAB_ID.AccountDetails]: (props) => getEntityAttributeDetails(TAB_ID.AccountDetails, props),

  [TAB_ID.LeadActivityHistory]: ({
    entityDetailsType,
    entityIds,
    entityRepNames,
    entityTypeRepName
  }) =>
    getActivityHistoryRoot({
      entityType: EntityType.Lead,
      entityDetailsType,
      entityIds,
      entityRepNames,
      entityTypeRepName: entityTypeRepName || ''
    }),

  [TAB_ID.ActivityHistory]: ({
    entityDetailsType,
    entityIds,
    entityRepNames,
    eventCode,
    entityTypeRepName
  }) =>
    getActivityHistoryRoot({
      entityType: EntityType.Opportunity,
      entityDetailsType,
      entityIds,
      entityRepNames,
      eventCode,
      entityTypeRepName: entityTypeRepName || ''
    }),

  [TAB_ID.AccountActivityHistory]: ({
    entityDetailsType,
    entityIds,
    entityRepNames,
    entityTypeRepName
  }) =>
    getActivityHistoryRoot({
      entityType: EntityType.Account,
      entityDetailsType,
      entityIds,
      entityRepNames,
      entityTypeRepName: entityTypeRepName || ''
    }),

  [TAB_ID.LeadDocuments]: ({ entityDetailsType, entityIds, entityRepNames }) =>
    getDocuments({
      entityType: entityDetailsType,
      entityIds: entityIds,
      entityRepNames: entityRepNames
    }),

  [TAB_ID.Documents]: ({ entityDetailsType, entityIds, entityRepNames, entityTypeRepName }) =>
    getDocuments({
      entityType: entityDetailsType,
      entityIds: entityIds,
      entityRepNames: entityRepNames,
      entityTypeRepName: entityTypeRepName
    }),

  [TAB_ID.LeadNotes]: ({ entityDetailsType, entityIds, entityRepNames }) =>
    getNotes(entityDetailsType, entityIds, entityRepNames),

  [TAB_ID.Notes]: ({ entityDetailsType, entityIds, entityRepNames }) =>
    getNotes(entityDetailsType, entityIds, entityRepNames),

  [TAB_ID.LeadTasks]: (props) =>
    getTasks({
      tabId: TAB_ID.LeadTasks,
      coreData: props
    }),

  [TAB_ID.Tasks]: (props) =>
    getTasks({
      tabId: TAB_ID.Tasks,
      coreData: props
    }),

  [TAB_ID.LeadShareHistory]: (coreData) => getLeadShareHistory(coreData),
  [TAB_ID.RelatedLeads]: (coreData) => getRelatedLeads(coreData),
  [TAB_ID.Leads]: (coreData) => getRelatedLeads(coreData),
  [TAB_ID.OpportunityShareHistory]: (coreData) => getLeadShareHistory(coreData),
  [TAB_ID.SalesActivityDetails]: (coreData) => getSalesActivityTab(coreData),
  [TAB_ID.LeadOpportunities]: (coreData) => getLeadOpportunityTab(coreData),
  [TAB_ID.LeadEntityAuditLogs]: (coreData) => getEntityAuditTrailTab(coreData)
};
