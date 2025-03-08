import UserName from 'common/component-lib/user-name';
import { PHONE_ACTIVITIES_TYPES } from 'apps/activity-history/constants';
import { IAdditionalDetails } from '../../../types';
import { getActivityDetails } from './utils';
import { CallerSource } from 'src/common/utils/rest-client';

const InboundPhoneCallActivity = ({
  additionalDetails
}: {
  additionalDetails: IAdditionalDetails;
}): JSX.Element | null => {
  const { callStatus, duration, resourceUrl, display, createdBy } =
    getActivityDetails(additionalDetails);

  const answeredText = 'Inbound Call: Had a phone call with';

  const unAnsweredText = 'Inbound Call: Missed call';

  const phoneActivityTexts = {
    [PHONE_ACTIVITIES_TYPES.ANSWERED]: answeredText,
    [PHONE_ACTIVITIES_TYPES.COMPLETE]: answeredText,
    [PHONE_ACTIVITIES_TYPES.INCOMPLETE]: unAnsweredText,
    [PHONE_ACTIVITIES_TYPES.MISSED]: unAnsweredText,
    [PHONE_ACTIVITIES_TYPES.VOICEMAIL]: 'Inbound Call: Left a voice mail.',
    default: 'Inbound phone call activity'
  };

  const callStatusLower = callStatus?.toLowerCase();
  const activityTextKey = Object.prototype.hasOwnProperty.call(phoneActivityTexts, callStatusLower)
    ? callStatusLower
    : 'default';
  const activityText = phoneActivityTexts[activityTextKey] as string;

  let renderInboundPhoneContent = <span>Inbound phone call activity {callStatusLower}</span>;

  if (
    [PHONE_ACTIVITIES_TYPES.ANSWERED, PHONE_ACTIVITIES_TYPES.COMPLETE].includes(callStatusLower)
  ) {
    renderInboundPhoneContent = (
      <span className="answered-call-wrapper">
        {activityText}{' '}
        <UserName
          name={display}
          id={createdBy}
          callerSource={CallerSource.ActivityHistoryPhoneActivity}
        />{' '}
        {duration ? `Duration: ${duration}.` : null}
      </span>
    );
  }

  if (
    [
      PHONE_ACTIVITIES_TYPES.INCOMPLETE,
      PHONE_ACTIVITIES_TYPES.MISSED,
      PHONE_ACTIVITIES_TYPES.VOICEMAIL
    ].includes(callStatusLower)
  ) {
    renderInboundPhoneContent = !resourceUrl ? (
      <span>Inbound Call: Missed call.</span>
    ) : (
      <span>Inbound Call: Left a voice mail. Duration: {duration}.</span>
    );
  }

  return <>{renderInboundPhoneContent}</>;
};

export default InboundPhoneCallActivity;
