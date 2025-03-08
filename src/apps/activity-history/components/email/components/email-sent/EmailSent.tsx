import { IAugmentedAHDetail } from 'apps/activity-history/types';
import { getEmailOrUserName, getEmailSentText, getUserName } from '../../utils';
import { EMAIL_SENT_TYPES } from 'apps/activity-history/constants';
import Subject from '../subject';
import AutomationText from '../automation-text';

export interface IEmailSent {
  data: IAugmentedAHDetail;
}

// eslint-disable-next-line complexity
const EmailSent = ({ data }: IEmailSent): JSX.Element => {
  const { AdditionalDetails } = data;

  const campaignActivityType = AdditionalDetails?.CampaignActivityType;
  const campaignActivityRecordId = AdditionalDetails?.CampaignActivityRecordId;
  const email = AdditionalDetails?.CARUserEmailAddress;
  const user = getUserName(AdditionalDetails?.CARUserFirstName, AdditionalDetails?.CARUserLastName);

  let renderEmailSent = <></>;
  switch (campaignActivityType) {
    case EMAIL_SENT_TYPES.SENT_WITH_SUBJECT:
      renderEmailSent = (
        <div>
          {getEmailSentText(campaignActivityType)} <Subject additionalDetails={AdditionalDetails} />
        </div>
      );
      break;
    case EMAIL_SENT_TYPES.SENT_WITH_SUBJECT_USER_EMAIL:
    case EMAIL_SENT_TYPES.SENT_EMAIL_SUBJECT_EIGHT:
    case EMAIL_SENT_TYPES.SENT_WITH_SUBJECT_EMAIL:
      renderEmailSent = (
        <div>
          {getEmailSentText(campaignActivityType)} <Subject additionalDetails={AdditionalDetails} />{' '}
          by {getEmailOrUserName(user, email)}
        </div>
      );
      break;
    case EMAIL_SENT_TYPES.SENT_NOTIFICATION_EMAIL:
      renderEmailSent = (
        <div>
          {getEmailSentText(campaignActivityType)} <Subject additionalDetails={AdditionalDetails} />
        </div>
      );
      break;
    case EMAIL_SENT_TYPES.SENT_EMAIL_THROUGH_EMAIL_CLIENT:
    case EMAIL_SENT_TYPES.SENT_REFERRAL_CAMPAIGN_EMAIL:
      renderEmailSent = (
        <div>
          {getEmailSentText(campaignActivityType)} <Subject additionalDetails={AdditionalDetails} />{' '}
          by {getEmailOrUserName(user, email)}
        </div>
      );
      break;
    case EMAIL_SENT_TYPES.SENT_AUTOMATION_EMAIL:
      renderEmailSent = (
        <div>
          Sent <AutomationText campaignActivityRecordId={campaignActivityRecordId} /> email with
          subject <Subject additionalDetails={AdditionalDetails} /> by{' '}
          {getEmailOrUserName(user, email)}
        </div>
      );
      break;
    default:
      renderEmailSent = <>{data?.ActivityName}</>;
  }

  return <div data-testid="email-sent">{renderEmailSent}</div>;
};

export default EmailSent;
