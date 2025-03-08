import { ITimeline } from 'apps/activity-history/types';
import { ACTIVITY } from 'apps/activity-history/constants';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import ActivityTable from 'common/component-lib/activity-table';
import Opportunity from '../shared/opportunity';
import ActivityScore from '../shared/activity-score';
import BodyWrapper from '../shared/body-wrapper';
import MetaDataInfo from '../shared/metadata-info';
import { CallerSource } from 'common/utils/rest-client';

const Body = (props: ITimeline): JSX.Element => {
  const { data, leadRepresentationName, entityDetailsCoreData } = props;

  const { Id, ActivityType, ActivityDateTime, ActivityEvent, AdditionalDetails, LeadId } =
    data || {};

  const isOppDetailsPage = !!entityDetailsCoreData?.entityIds?.opportunity;

  const {
    ActivityScore: Score,
    RelatedActivityId,
    CreatedByName,
    CreatedBy
  } = AdditionalDetails || {};

  const accordionName =
    ActivityEvent === ACTIVITY.DUPLICATE_OPP_DETECTED
      ? 'Duplicate Detected'
      : 'Opportunity Capture';

  const renderOpportunity = (): JSX.Element => {
    if (
      ActivityEvent === ACTIVITY.DUPLICATE_OPP_DETECTED ||
      ActivityEvent === ACTIVITY.OPPORTUNITY_CAPTURE
    ) {
      return (
        <>
          <Accordion
            name={accordionName}
            defaultState={DefaultState.CLOSE}
            arrowRotate={{
              angle: ArrowRotateAngle.Deg90,
              direction: ArrowRotateDirection.ClockWise
            }}>
            <ActivityTable
              id={Id as string}
              typeCode={ActivityType as number}
              eventCode={ActivityEvent as number}
              additionalDetails={AdditionalDetails as Record<string, string>}
              callerSource={CallerSource.ActivityHistoryOpportunityActivity}
              leadRepresentationName={leadRepresentationName}
            />
          </Accordion>
          {!isOppDetailsPage && RelatedActivityId ? (
            <Opportunity
              additionalDetails={AdditionalDetails}
              activityEvent={ActivityEvent as number}
              leadId={LeadId}
            />
          ) : null}
          <MetaDataInfo
            byLabel="Added by"
            activityDateTime={ActivityDateTime}
            createdByName={CreatedByName}
            createdBy={CreatedBy}
            callerSource={CallerSource.ActivityHistoryOpportunityActivity}
          />
        </>
      );
    }
    return <span>Opportunity Activity</span>;
  };
  return (
    <BodyWrapper>
      <>
        <div className="body-content">{renderOpportunity()}</div>
        <ActivityScore activityScore={Score || ''} />
      </>
    </BodyWrapper>
  );
};

export default Body;
