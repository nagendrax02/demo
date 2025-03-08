import { EMAIL_UNSUBSCRIBE_TYPES } from 'apps/activity-history/constants';

const getEmailUnsubscribeLinkClickedText = (
  campaignActivityType: string,
  campaignActivityName: string
): string => {
  switch (campaignActivityType) {
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_CAMPAIGN:
      if (campaignActivityName) {
        return `Clicked on unsubscribe link from email Campaign ${campaignActivityName} with subject`;
      }
      return `Clicked on unsubscribe link from email with subject`;
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_ONE:
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_FOUR:
    case EMAIL_UNSUBSCRIBE_TYPES.EMAIL_SENT_BY_SIX:
    case EMAIL_UNSUBSCRIBE_TYPES.REFERRAL_EMAIL:
      return `Clicked on unsubscribe link from email with subject`;
    default:
      /* istanbul ignore next */
      return '';
  }
};

export { getEmailUnsubscribeLinkClickedText };
