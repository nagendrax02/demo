import { EMAIL_UNSUBSCRIBE_TYPES } from 'apps/activity-history/constants';
import { getEmailOrUserName } from '../../utils';

interface IGetEmailUnsubscribedText {
  campaignActivityType: string;
  campaignActivityName: string | undefined;
  user: string;
  email: string | undefined;
}

// eslint-disable-next-line complexity
const getEmailUnsubscribedText = ({
  campaignActivityType,
  campaignActivityName,
  user,
  email
}: IGetEmailUnsubscribedText): string => {
  const userNameAndMail = getEmailOrUserName(user, email).trimEnd();
  /* istanbul ignore next */
  switch (campaignActivityType) {
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_CAMPAIGN:
      if (campaignActivityName) {
        return `Unsubscribed from email Campaign “${campaignActivityName}” with subject`;
      }
      return `Unsubscribed from email with subject`;
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_ONE:
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_FOUR:
    case EMAIL_UNSUBSCRIBE_TYPES.NOTIFICATION_EMAIL:
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_SIX:
      if (userNameAndMail) {
        return `Unsubscribed from email sent by ${userNameAndMail} with subject`;
      }
      return `Unsubscribed from email with subject`;
    /* istanbul ignore next */
    case EMAIL_UNSUBSCRIBE_TYPES.REFERRAL_EMAIL:
      if (userNameAndMail) {
        return `Unsubscribed from Referral Campaign email sent by ${userNameAndMail} with subject`;
      }
      /* istanbul ignore next */
      return `Unsubscribed from Referral Campaign email with subject`;
    default:
      /* istanbul ignore next */
      return '';
  }
};

export { getEmailUnsubscribedText };
