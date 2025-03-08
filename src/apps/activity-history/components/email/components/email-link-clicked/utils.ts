import { EMAIL_CLICK } from 'apps/activity-history/constants';
import { getEmailOrUserName } from '../../utils';

interface IGetEmailLinkClickedText {
  campaignActivityType: string;
  campaignActivityName: string | undefined;
  user: string;
  email: string | undefined;
}

// eslint-disable-next-line complexity
const getEmailLinkClickedText = ({
  campaignActivityType,
  campaignActivityName,
  user,
  email
}: IGetEmailLinkClickedText): string => {
  const userNameAndMail = getEmailOrUserName(user, email).trimEnd();
  switch (campaignActivityType) {
    case EMAIL_CLICK.OPENED_EMAIL_CAMPAIGN:
      /* istanbul ignore else */
      if (campaignActivityName) {
        return `Opened email campaign ${campaignActivityName} with subject`;
      }
      return `Opened email with subject`;
    case EMAIL_CLICK.OPENED_NOTIFICATION_EMAIL:
      return `Opened email with subject`;
    case EMAIL_CLICK.OPENED_REFERRAL_EMAIL:
      /* istanbul ignore else */
      if (userNameAndMail) {
        return `Opened Referral Campaign email sent by ${userNameAndMail} with subject`;
      }
      return `Opened Referral Campaign email with subject`;
    default:
      /* istanbul ignore next */
      return campaignActivityName || '';
  }
};

export { getEmailLinkClickedText };
