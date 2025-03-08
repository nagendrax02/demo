/* eslint-disable complexity */
import { IAugmentedAHDetail } from 'apps/activity-history/types';
import { getEmailOrUserName, getUserName } from '../../utils';
import { EMAIL_UNSUBSCRIBE_TYPES } from 'apps/activity-history/constants';
import { getEmailUnsubscribedText } from './utils';
import Subject from '../subject';
import AutomationText from '../automation-text';

export interface IEmailUnsubscribed {
  data: IAugmentedAHDetail;
}

const EmailUnsubscribed = ({ data }: IEmailUnsubscribed): JSX.Element => {
  const { AdditionalDetails } = data;
  const email = AdditionalDetails?.CARUserEmailAddress;
  /* istanbul ignore next */
  const subject = AdditionalDetails?.EmailSubject || '';
  /* istanbul ignore next */
  const user = getUserName(AdditionalDetails?.CARUserFirstName, AdditionalDetails?.CARUserLastName);
  const campaignActivityType = AdditionalDetails?.CampaignActivityType;
  const campaignActivityName = AdditionalDetails?.CampaignActivityName;
  const campaignActivityRecordId = AdditionalDetails?.CampaignActivityRecordId;
  /* istanbul ignore next */
  const userNameAndMail = getEmailOrUserName(user, email).trimEnd();
  let renderEmailUnsubscribed = <></>;
  /* istanbul ignore next */
  switch (campaignActivityType) {
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_CAMPAIGN:
      renderEmailUnsubscribed = (
        <>
          {getEmailUnsubscribedText({ campaignActivityType, campaignActivityName, user, email })}{' '}
          {subject}
        </>
      );
      break;
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_ONE:
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_FOUR:
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_SIX:
    case EMAIL_UNSUBSCRIBE_TYPES.NOTIFICATION_EMAIL:
    case EMAIL_UNSUBSCRIBE_TYPES.REFERRAL_EMAIL:
      renderEmailUnsubscribed = (
        <>
          {getEmailUnsubscribedText({ campaignActivityType, campaignActivityName, user, email })}{' '}
          <Subject additionalDetails={AdditionalDetails} />
        </>
      );
      break;
    case EMAIL_UNSUBSCRIBE_TYPES.AUTOMATION_EMAIL:
      if (userNameAndMail) {
        renderEmailUnsubscribed = (
          <>
            Unsubscribed from <AutomationText campaignActivityRecordId={campaignActivityRecordId} />{' '}
            email sent by {userNameAndMail} with subject{' '}
            <Subject additionalDetails={AdditionalDetails} />
          </>
        );
      }
      renderEmailUnsubscribed = (
        <>
          Unsubscribed from <AutomationText campaignActivityRecordId={campaignActivityRecordId} />{' '}
          email with subject <Subject additionalDetails={AdditionalDetails} />
        </>
      );
      break;
    default:
      renderEmailUnsubscribed = <>Unsubscribed from email</>;
  }
  return <div>{renderEmailUnsubscribed}</div>;
};

export default EmailUnsubscribed;
