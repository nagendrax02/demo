import { IAugmentedAHDetail } from 'apps/activity-history/types';
import { EMAIL_UNSUBSCRIBE_TYPES } from 'apps/activity-history/constants';
import { getEmailUnsubscribeLinkClickedText } from './utils';
import Subject from '../subject';
import AutomationText from '../automation-text';

export interface IEmailUnsubscribedLinkClicked {
  data: IAugmentedAHDetail;
}
// eslint-disable-next-line complexity
const EmailUnsubscribedLinkClicked = ({ data }: IEmailUnsubscribedLinkClicked): JSX.Element => {
  const { AdditionalDetails } = data;
  const subject = AdditionalDetails?.EmailSubject || '';
  const campaignActivityType = AdditionalDetails?.CampaignActivityType;
  const campaignActivityName = AdditionalDetails?.CampaignActivityName;
  const campaignActivityRecordId = AdditionalDetails?.CampaignActivityRecordId;

  let renderEmailUnsubscribedLinkClicked = <></>;

  switch (campaignActivityType) {
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_CAMPAIGN:
      renderEmailUnsubscribedLinkClicked = (
        <>
          {getEmailUnsubscribeLinkClickedText(campaignActivityType, campaignActivityName || '')}{' '}
          {subject}
        </>
      );
      break;
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_ONE:
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_FOUR:
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_SIX:
    case EMAIL_UNSUBSCRIBE_TYPES.REFERRAL_EMAIL:
      renderEmailUnsubscribedLinkClicked = (
        <>
          {getEmailUnsubscribeLinkClickedText(campaignActivityType, campaignActivityName || '')}{' '}
          <Subject additionalDetails={AdditionalDetails} />
        </>
      );
      break;
    case EMAIL_UNSUBSCRIBE_TYPES.AUTOMATION_EMAIL:
      renderEmailUnsubscribedLinkClicked = (
        <>
          Clicked on unsubscribe link from{' '}
          <AutomationText campaignActivityRecordId={campaignActivityRecordId} /> email with subject{' '}
          <Subject additionalDetails={AdditionalDetails} />
        </>
      );
      break;
    default:
      /* istanbul ignore next */
      renderEmailUnsubscribedLinkClicked = <>Email unsubscribe link click event</>;
  }

  return <div>{renderEmailUnsubscribedLinkClicked}</div>;
};

export default EmailUnsubscribedLinkClicked;
