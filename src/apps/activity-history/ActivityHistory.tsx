/* istanbul ignore file */
import { Suspense, useEffect } from 'react';
import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { TimelineGroup } from 'common/component-lib/timeline';
import { TimelineGroupShimmer } from '@lsq/nextgen-preact/timeline/timeline-group';
import TimelineShimmer from '@lsq/nextgen-preact/timeline/timeline-shimmer';
import EmptyState from 'common/component-lib/empty-state';
import {
  Default,
  Portal,
  DeleteLogs,
  Web,
  Privacy,
  Email,
  Phone,
  LeadCapture,
  OpportunityActivity,
  OpportunityAudit,
  LeadAudit,
  Custom,
  DynamicFormSubmission,
  Task,
  Notes
} from './components';
import styles from './activity-history.module.css';
import useActivityHistory from './use-activity-history';
import {
  ActivityRenderType,
  IActivityHistory,
  IAugmentedAHDetail,
  IActivityComponents,
  ITimeline,
  IActivityHistoryStore
} from './types';
import Filters from './components/filters';
import Header from 'common/component-lib/entity-tabs-header';
import ActivityHistoryActions from './ActivityHistoryActions';
import {
  getExperienceKey,
  startExperienceEvent,
  ExperienceType,
  endExperienceEvent
} from 'common/utils/experience';
import { endEntityDetailsLoadExperience } from 'common/utils/experience/utils/module-utils';
import { EntityType } from 'common/types';
import useActivityHistoryStore from './activity-history.store';
import { EntityDetailsEvents } from 'common/utils/experience';

// eslint-disable-next-line complexity
const ActivityHistory = ({
  type,
  customTypeFilter,
  tabType,
  entityDetailsCoreData
}: IActivityHistory): JSX.Element => {
  const experienceConfig = getExperienceKey();
  startExperienceEvent({
    module: experienceConfig.module,
    experience: ExperienceType.Load,
    event: EntityDetailsEvents.ActivityHistoryRender,
    key: experienceConfig.key
  });

  const { entityIds, entityDetailsType, eventCode } = entityDetailsCoreData;

  const { isLoading, isLoadingNextPage, augmentedAHDetails, intersectionRef } = useActivityHistory({
    type,
    customTypeFilter,
    tabType,
    entityIds,
    eventCode
  });

  const { accountLeadSelectedOption } = useActivityHistoryStore<IActivityHistoryStore>();

  const leadRepName = useLeadRepName();

  const activityComponents: IActivityComponents = {
    [ActivityRenderType.Custom]: Custom,
    [ActivityRenderType.DeleteLogs]: DeleteLogs,
    [ActivityRenderType.DynamicForm]: DynamicFormSubmission,
    [ActivityRenderType.Email]: Email,
    [ActivityRenderType.LeadAudit]: LeadAudit,
    [ActivityRenderType.LeadCapture]: LeadCapture,
    [ActivityRenderType.Note]: Notes,
    [ActivityRenderType.Opportunity]: OpportunityActivity,
    [ActivityRenderType.OpportunityAudit]: OpportunityAudit,
    [ActivityRenderType.Phone]: Phone,
    [ActivityRenderType.Portal]: Portal,
    [ActivityRenderType.Privacy]: Privacy,
    [ActivityRenderType.Task]: Task,
    [ActivityRenderType.Default]: Default,
    [ActivityRenderType.Web]: Web
  };

  const renderActivityContent = (activity: IAugmentedAHDetail): JSX.Element => {
    const ActivityComponent = (activityComponents[activity.ActivityRenderType] ||
      Default) as React.FC<ITimeline>;
    return (
      <ActivityComponent
        data={activity}
        leadRepresentationName={leadRepName}
        entityIds={entityIds}
        entityType={entityDetailsType}
        type={type}
        entityDetailsCoreData={entityDetailsCoreData}
      />
    );
  };

  const itemContent = (activity: IAugmentedAHDetail): JSX.Element => (
    <Suspense
      key={activity.Id}
      fallback={<TimelineShimmer customClassName={styles.timeline_shimmer} />}>
      {renderActivityContent(activity)}
    </Suspense>
  );

  useEffect(() => {
    if (!isLoading) {
      endExperienceEvent({
        module: experienceConfig.module,
        experience: ExperienceType.Load,
        event: EntityDetailsEvents.ActivityHistoryRender,
        key: experienceConfig.key
      });

      endEntityDetailsLoadExperience();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const getEmptyStateLayout = (): JSX.Element => {
    if (entityIds?.account && type === EntityType.Lead && !accountLeadSelectedOption?.length) {
      return <EmptyState name="person" title="Please select a lead to view Activities" />;
    }
    return <EmptyState title="No activities found" />;
  };

  return (
    <>
      <Header>
        <Filters
          tabType={tabType}
          customTypeFilter={customTypeFilter}
          type={type}
          entityIds={entityIds}
          eventCode={eventCode ? `${eventCode}` : undefined}
        />
      </Header>
      <div className={styles.activity_history_wrapper}>
        {isLoading ? <TimelineGroupShimmer /> : null}
        {!augmentedAHDetails?.length && !isLoading ? (
          <div className={styles.empty_state_container}>{getEmptyStateLayout()}</div>
        ) : null}
        {augmentedAHDetails?.length && !isLoading ? (
          <TimelineGroup
            records={augmentedAHDetails || []}
            recordIdentifierPropKey="Id"
            groupPropKey="ActivityDateTime"
            itemContent={itemContent}
            isLoading={isLoadingNextPage}
          />
        ) : null}
        {augmentedAHDetails?.length ? <div ref={intersectionRef} /> : null}
      </div>
      <ActivityHistoryActions type={type} />
    </>
  );
};

export default ActivityHistory;
