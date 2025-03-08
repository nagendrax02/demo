import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import ActivityTable from 'common/component-lib/activity-table';
import AudioPlayer from 'common/component-lib/audio-player/AudioPlayer';
import { ACTIVITY } from 'apps/activity-history/constants';
import ActivityScore from '../../shared/activity-score';
import BodyWrapper from '../../shared/body-wrapper';
import { ITimeline } from '../../../types';
import OutboundPhoneCallActivity from './OutboundPhoneCallActivity';
import InboundPhoneCallActivity from './InboundPhoneCallActivity';
import { getActivityDetails } from './utils';
import { CallerSource } from 'common/utils/rest-client';

const Body = (props: ITimeline): JSX.Element => {
  const { data } = props;

  const { Id, ActivityType, AdditionalDetails, ActivityEvent, IsEditable } = data || {};

  const { ActivityScore: Score } = AdditionalDetails || {};

  const { resourceUrl } = getActivityDetails(AdditionalDetails);

  const activityComponents = {
    [ACTIVITY.INBOUND_PHONE_CALL_ACTIVITY]: InboundPhoneCallActivity,
    [ACTIVITY.OUTBOUND_PHONE_CALL_ACTIVITY]: OutboundPhoneCallActivity
  };

  const renderCallActivity = (): JSX.Element | null => {
    if (AdditionalDetails && ActivityEvent) {
      const ActivityComponent = activityComponents[ActivityEvent];
      if (ActivityComponent) {
        return <ActivityComponent additionalDetails={AdditionalDetails} />;
      }
    }
    return null;
  };

  return (
    <BodyWrapper>
      <>
        <div className="body-content phone-activity" data-testid="phone-activity">
          {renderCallActivity()}
          <Accordion
            name="View details"
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
              callerSource={CallerSource.ActivityHistoryPhoneActivity}
            />
          </Accordion>

          <div className="audio-player-wrapper">
            <AudioPlayer fileURL={resourceUrl} enableDownload={!!(IsEditable && IsEditable > 0)} />
          </div>
        </div>
        <ActivityScore activityScore={Score || ''} />
      </>
    </BodyWrapper>
  );
};

export default Body;
