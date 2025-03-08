import { IAugmentedAHDetail } from 'apps/activity-history/types';
import { EMAIL_UNSUBSCRIBE_TYPES } from 'apps/activity-history/constants';
import { getEmailOrUserName, getUserName } from '../../utils';
import Subject from '../subject';
import AutomationText from '../automation-text';
import styles from './custom-email-sub.module.css';

export interface ICustomEmailSubscription {
  data: IAugmentedAHDetail;
}

// eslint-disable-next-line complexity
const CustomEmailSubscription = ({ data }: ICustomEmailSubscription): JSX.Element => {
  const { AdditionalDetails } = data;
  const campaignActivityType = AdditionalDetails?.CampaignActivityType;
  const campaignActivityName = AdditionalDetails?.CampaignActivityName;
  const subject = AdditionalDetails?.EmailSubject || '';
  const email = AdditionalDetails?.CARUserEmailAddress;
  const campaignActivityRecordId = AdditionalDetails?.CampaignActivityRecordId;
  const activityName = data.ActivityName;
  const user = getUserName(AdditionalDetails?.CARUserFirstName, AdditionalDetails?.CARUserLastName);
  const userNameAndMail = getEmailOrUserName(user, email).trimEnd();
  const webPublishedURL = AdditionalDetails?.WebPublishedURL;
  const webContentName = AdditionalDetails?.WebContentName;
  let renderCustomEmailSubscription = <></>;

  switch (campaignActivityType) {
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_CAMPAIGN:
      if (campaignActivityName) {
        renderCustomEmailSubscription = (
          <>
            {activityName} in email campaign &quot;{campaignActivityName}&quot; with subject{' '}
            {subject}
          </>
        );
      }
      renderCustomEmailSubscription = (
        <>
          {activityName} in email with subject {subject}
        </>
      );
      break;
    case EMAIL_UNSUBSCRIBE_TYPES.REFERRAL_EMAIL:
      /* istanbul ignore else */
      if (userNameAndMail) {
        renderCustomEmailSubscription = (
          <>
            {activityName} in Referral Campaign email sent by {userNameAndMail} with subject{' '}
            <Subject additionalDetails={AdditionalDetails} />
          </>
        );
      } else {
        renderCustomEmailSubscription = (
          <>
            {activityName} in Referral Campaign email with subject{' '}
            <Subject additionalDetails={AdditionalDetails} />
          </>
        );
      }
      break;
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_ONE:
    case EMAIL_UNSUBSCRIBE_TYPES.NOTIFICATION_EMAIL:
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_FOUR:
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_SIX:
      /* istanbul ignore else */
      if (userNameAndMail) {
        renderCustomEmailSubscription = (
          <>
            {activityName} in email sent by {userNameAndMail} with subject{' '}
            <Subject additionalDetails={AdditionalDetails} />
          </>
        );
      } else {
        renderCustomEmailSubscription = (
          <>
            {activityName} in email with subject <Subject additionalDetails={AdditionalDetails} />
          </>
        );
      }
      break;
    case EMAIL_UNSUBSCRIBE_TYPES.AUTOMATION_EMAIL:
      /* istanbul ignore else */
      if (userNameAndMail) {
        renderCustomEmailSubscription = (
          <>
            {activityName} in <AutomationText campaignActivityRecordId={campaignActivityRecordId} />{' '}
            email sent by {userNameAndMail} with subject{' '}
            <Subject additionalDetails={AdditionalDetails} />
          </>
        );
      } else {
        renderCustomEmailSubscription = (
          <>
            {activityName} in <AutomationText campaignActivityRecordId={campaignActivityRecordId} />{' '}
            email with subject <Subject additionalDetails={AdditionalDetails} />
          </>
        );
      }
      break;

    default:
      /* istanbul ignore next */
      if (webPublishedURL && webContentName) {
        renderCustomEmailSubscription = (
          <>
            {activityName} on{' '}
            <a href={webPublishedURL} target="_blank" rel="noopener" className={styles.link}>
              {webContentName}
            </a>
          </>
        );
      } else if (userNameAndMail) {
        renderCustomEmailSubscription = (
          <>
            {activityName} in email sent by {userNameAndMail} with subject{' '}
            <Subject additionalDetails={AdditionalDetails} />
          </>
        );
      } else {
        renderCustomEmailSubscription = (
          <>
            {activityName} in email with subject <Subject additionalDetails={AdditionalDetails} />.
          </>
        );
      }
  }
  return <div data-testid="custom-email">{renderCustomEmailSubscription}</div>;
};

export default CustomEmailSubscription;
