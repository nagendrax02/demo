import { ITimeline } from 'apps/activity-history/types';
import { ACTIVITY } from 'apps/activity-history/constants';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import ActivityTable from 'common/component-lib/activity-table';
import BodyWrapper from '../../shared/body-wrapper';
import MetaDataInfo from '../../shared/metadata-info';
import ActivityScore from '../../shared/activity-score';
import { CallerSource } from 'common/utils/rest-client';

const getAccordionName = (event?: number): JSX.Element | string => {
  if (event === ACTIVITY.DO_NOT_TRACK_REQUEST) return 'View Details';
  if (event === ACTIVITY.OPTED_IN_FOR_EMAIL) return <span>Opted-in for Email</span>;
  if (event === ACTIVITY.OPTED_OUT_FOR_EMAIL) return <span>Opted-out for Email</span>;
  return '';
};

const getUserName = (firstName?: string, lastName?: string): string => {
  return `${firstName || ''} ${lastName || ''}`.trimEnd();
};

const Body = (props: ITimeline): JSX.Element => {
  const { Id, ActivityType, AdditionalDetails, ActivityEvent, ActivityDateTime } = props.data || {};

  const {
    ActivityUserFirstName,
    ActivityUserLastName,
    MXCustom2,
    CreatedBy,
    ActivityScore: score
  } = AdditionalDetails || {};

  const isDisabled = parseFloat(MXCustom2 || '') === 1;

  const doNotTrackRequest =
    ActivityEvent === ACTIVITY.DO_NOT_TRACK_REQUEST ? (
      <span>Do Not Track Request: {isDisabled ? 'Tracking Disabled' : 'Tracking Enabled'}!</span>
    ) : null;

  return (
    <BodyWrapper>
      <>
        <div className="body-content">
          {doNotTrackRequest}
          <Accordion
            name={getAccordionName(ActivityEvent)}
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
              callerSource={CallerSource.ActivityHistoryPrivacyActivity}
            />
          </Accordion>
          <MetaDataInfo
            byLabel="Added by"
            activityDateTime={ActivityDateTime}
            createdByName={getUserName(ActivityUserFirstName, ActivityUserLastName)}
            createdBy={CreatedBy}
            callerSource={CallerSource.ActivityHistoryPrivacyActivity}
          />
        </div>
        <ActivityScore activityScore={score || ''} />
      </>
    </BodyWrapper>
  );
};

export default Body;
