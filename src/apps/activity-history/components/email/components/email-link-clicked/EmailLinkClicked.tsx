/* eslint-disable complexity */
import { IAugmentedAHDetail } from 'apps/activity-history/types';
import { getEmailOrUserName, getUserName } from '../../utils';
import { EMAIL_CLICK } from 'apps/activity-history/constants';
import { getEmailLinkClickedText } from './utils';
import Link from '../link';
import Subject from '../subject';
import AutomationText from '../automation-text';

export interface IEmailLinkClicked {
  data: IAugmentedAHDetail;
}

const EmailLinkClicked = ({ data }: IEmailLinkClicked): JSX.Element => {
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
  const activityEventNote = AdditionalDetails?.ActivityEvent_Note;
  let renderEmailLinkClicked = <></>;
  switch (campaignActivityType) {
    case EMAIL_CLICK.OPENED_EMAIL_CAMPAIGN:
      renderEmailLinkClicked = (
        <>
          {getEmailLinkClickedText({ campaignActivityType, campaignActivityName, user, email })}{' '}
          {subject} <Link value={activityEventNote || ''} />
        </>
      );
      break;
    case EMAIL_CLICK.OPENED_EMAIL_SENT_BY_ONE:
    case EMAIL_CLICK.OPENED_EMAIL_SENT_BY_FOUR:
    case EMAIL_CLICK.OPENED_EMAIL_SENT_BY_EIGHT:
    case EMAIL_CLICK.OPENED_EMAIL_SENT_BY_SIX:
    case EMAIL_CLICK.OPENED_NOTIFICATION_EMAIL:
      /* istanbul ignore next */
      renderEmailLinkClicked = (
        <>
          {getEmailLinkClickedText({ campaignActivityType, campaignActivityName, user, email })}{' '}
          <Subject additionalDetails={AdditionalDetails} /> <Link value={activityEventNote || ''} />
        </>
      );
      break;
    case EMAIL_CLICK.OPENED_REFERRAL_EMAIL:
      renderEmailLinkClicked = (
        <>
          {getEmailLinkClickedText({ campaignActivityType, campaignActivityName, user, email })}{' '}
          <Subject additionalDetails={AdditionalDetails} />
        </>
      );
      break;
    case EMAIL_CLICK.OPENED_AUTOMATION_EMAIL:
      /* istanbul ignore else */
      if (userNameAndMail) {
        renderEmailLinkClicked = (
          <>
            Opened <AutomationText campaignActivityRecordId={campaignActivityRecordId} /> email sent
            by {userNameAndMail} with subject <Subject additionalDetails={AdditionalDetails} />{' '}
            <Link value={activityEventNote || ''} />
          </>
        );
      } else {
        renderEmailLinkClicked = (
          <>
            Opened <AutomationText campaignActivityRecordId={campaignActivityRecordId} /> email with
            subject <Subject additionalDetails={AdditionalDetails} />{' '}
            <Link value={activityEventNote || ''} />
          </>
        );
      }
      break;
    default:
      renderEmailLinkClicked = <>Email Clicked Activity</>;
  }

  return <div>{renderEmailLinkClicked}</div>;
};

export default EmailLinkClicked;
