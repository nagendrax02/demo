import { ACTIVITY } from '../../constants';
import { IAugmentedAHDetail } from '../../types';

enum EmailRenderType {
  EmailBounced = ACTIVITY.EMAIL_BOUNCED,
  EmailSent = ACTIVITY.EMAIL_SENT,
  EmailLinkClicked = ACTIVITY.EMAIL_LINK_CLICKED,
  EmailUnsubscribe = ACTIVITY.EMAIL_UNSUBSCRIBE,
  EmailPositiveResponse = ACTIVITY.EMAIL_POSITIVE_RESPONSE,
  EmailNegativeResponse = ACTIVITY.EMAIL_NEGATIVE_RESPONSE,
  EmailNeutralResponse = ACTIVITY.EMAIL_NEUTRAL_RESPONSE,
  EmailInboundLead = ACTIVITY.EMAIL_INBOUND_LEAD,
  EmailUnsubscribeLinkClicked = ACTIVITY.EMAIL_UNSUBSCRIBE_LINK_CLICKED,
  EmailBrowserLinkClicked = ACTIVITY.VIEW_IN_BROWSER_LINK_CLICKED,
  EmailMarkedAsSpam = ACTIVITY.EMAIL_MARKED_AS_SPAM
}

type IEmailComponents = {
  [key in EmailRenderType]: React.FC<{ data: IAugmentedAHDetail }>;
};

export type { IEmailComponents };
export { EmailRenderType };
