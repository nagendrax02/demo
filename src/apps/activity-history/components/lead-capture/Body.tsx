import { ITimeline } from 'apps/activity-history/types';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import ActivityTable from 'common/component-lib/activity-table';
import { noteParser } from 'common/utils/helpers/activity-history';
import ActivityScore from '../shared/activity-score';
import BodyWrapper from '../shared/body-wrapper';
import MetaDataInfo from '../shared/metadata-info';
import { CallerSource } from 'common/utils/rest-client';

const Body = (props: ITimeline): JSX.Element => {
  const { data } = props;

  const { Id, ActivityType, ActivityEvent, ActivityName, AdditionalDetails } = data || {};

  const {
    ActivityScore: Score,
    ActivityEvent_Note: ActivityEventNote,
    CreatedByName,
    CreatedBy
  } = AdditionalDetails || {};

  const activityEventNote = noteParser(ActivityEventNote || '');

  const activityEventNoteDetails: { DisplayName: string; Value: string }[] = [];
  if (activityEventNote) {
    Object.keys(activityEventNote).forEach((item) => {
      activityEventNoteDetails.push({
        DisplayName: item,
        Value: activityEventNote[item]
      });
    });
  }

  return (
    <BodyWrapper>
      <>
        <div>
          {activityEventNoteDetails?.length ? (
            <Accordion
              name={ActivityName as string}
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
                callerSource={CallerSource.ActivityHistoryLeadCapture}
              />
            </Accordion>
          ) : null}
          <MetaDataInfo
            byLabel="Added by"
            createdByName={CreatedByName}
            createdBy={CreatedBy}
            callerSource={CallerSource.ActivityHistoryLeadCapture}
          />
        </div>
        <ActivityScore activityScore={Score || ''} />
      </>
    </BodyWrapper>
  );
};

export default Body;
