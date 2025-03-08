import { EMAIL_OPENED } from 'apps/activity-history/constants';
import { getEmailOrUserName } from '../../utils';

interface IGetEmailOpenedText {
  campaignActivityType: string;
  campaignActivityName: string | undefined;
  user: string;
  email: string | undefined;
}

// eslint-disable-next-line complexity
const getEmailOpenedText = ({
  campaignActivityType,
  campaignActivityName,
  user,
  email
}: IGetEmailOpenedText): string => {
  const userNameAndMail = getEmailOrUserName(user, email).trimEnd();

  switch (campaignActivityType) {
    case EMAIL_OPENED.OPENED_EMAIL_CAMPAIGN:
      if (campaignActivityName) {
        return `Opened email campaign ${campaignActivityName} with subject`;
      }
      /* istanbul ignore next */
      return 'Opened email with subject';
    case EMAIL_OPENED.OPENED_EMAIL_SENT_BY_ONE:
    case EMAIL_OPENED.OPENED_EMAIL_SENT_BY_FOUR:
    case EMAIL_OPENED.OPENED_EMAIL_SENT_BY_EIGHT:
    case EMAIL_OPENED.OPENED_EMAIL_SENT_BY_SIX:
      if (userNameAndMail) {
        return `Opened email sent by ${userNameAndMail} with subject`;
      }
      /* istanbul ignore next */
      return `Opened email with subject`;
    case EMAIL_OPENED.OPENED_NOTIFICATION_EMAIL:
      return 'Opened email with subject';
    case EMAIL_OPENED.OPENED_REFERRAL_EMAIL:
      if (userNameAndMail) {
        return `Opened Referral Campaign email sent by ${userNameAndMail} with subject`;
      }
      /* istanbul ignore next */
      return `Opened Referral Campaign email with subject`;
    case EMAIL_OPENED.OPENED_AUTOMATION_EMAIL:
      if (userNameAndMail) {
        return `Opened Automation email sent by ${userNameAndMail} with subject`;
      }
      /* istanbul ignore next */
      return `Opened Automation email with subject`;
    default:
      return '';
  }
};

export { getEmailOpenedText };
