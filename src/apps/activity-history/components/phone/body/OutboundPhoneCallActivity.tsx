import { PHONE_ACTIVITIES_TYPES } from 'apps/activity-history/constants';
import { IAdditionalDetails } from '../../../types';
import { getActivityDetails } from './utils';

const OutboundPhoneCallActivity = ({
  additionalDetails
}: {
  additionalDetails: IAdditionalDetails;
}): JSX.Element | null => {
  const { callStatus, duration, caller, displayNumber } = getActivityDetails(additionalDetails);

  const answeredText = 'Outbound Call: Was called by';

  const unAnsweredText = 'Outbound Call: Did not answer a call by';

  const phoneActivityTexts = {
    [PHONE_ACTIVITIES_TYPES.COMPLETE]: answeredText,
    [PHONE_ACTIVITIES_TYPES.ANSWERED]: answeredText,
    [PHONE_ACTIVITIES_TYPES.INCOMPLETE]: unAnsweredText,
    [PHONE_ACTIVITIES_TYPES.NOT_ANSWERED]: unAnsweredText,
    [PHONE_ACTIVITIES_TYPES.MISSED]: unAnsweredText,
    [PHONE_ACTIVITIES_TYPES.REJECTED]: 'Outbound Call: Rejected a call by',
    [PHONE_ACTIVITIES_TYPES.VOICEMAIL]: 'Outbound Call: A call by',
    [PHONE_ACTIVITIES_TYPES.CALL_FAILURE]: 'Outbound Call: Failed to place a call from',
    default: 'Outbound Call: Had a phone call with'
  };

  const callStatusLower = callStatus?.toLowerCase();
  const activityTextKey = Object.prototype.hasOwnProperty.call(phoneActivityTexts, callStatusLower)
    ? callStatusLower
    : 'default';
  const activityText = phoneActivityTexts[activityTextKey] as string;

  const renderOutboundPhoneContent = (
    <span>
      {activityText} {caller} {displayNumber ? `through ${displayNumber}.` : null}{' '}
      {callStatusLower === PHONE_ACTIVITIES_TYPES.VOICEMAIL ? `reached voicemail.` : null}
      {duration ? `Duration: ${duration}.` : null}{' '}
    </span>
  );

  return <>{renderOutboundPhoneContent}</>;
};

export default OutboundPhoneCallActivity;
