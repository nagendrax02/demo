import { IAugmentedAHDetail } from 'apps/activity-history/types';
import { EMAIL_BOUNCED_TYPES } from 'src/apps/activity-history/constants';

export interface IEmailBounced {
  data: IAugmentedAHDetail;
}

const EmailBounced = ({ data }: IEmailBounced): JSX.Element => {
  const { AdditionalDetails } = data;
  const campaignActivityType = AdditionalDetails?.CampaignActivityType;
  const campaignActivityName = AdditionalDetails?.CampaignActivityName;
  const activityEventNote = AdditionalDetails?.ActivityEvent_Note;
  let renderEmailBounced = <></>;

  switch (campaignActivityType) {
    case EMAIL_BOUNCED_TYPES.EMAIL_BOUNCED_WHILE_DELIVERING_SIX:
    case EMAIL_BOUNCED_TYPES.EMAIL_BOUNCED_WHILE_DELIVERING_ZERO:
    case EMAIL_BOUNCED_TYPES.EMAIL_BOUNCED_WHILE_DELIVERING_TWELVE:
      renderEmailBounced = (
        <>
          Email Address Bounced {activityEventNote} while delivering Email Campaign{' '}
          {campaignActivityName ? campaignActivityName : null}
        </>
      );
      break;
    default:
      renderEmailBounced = <> Email Address Bounced {activityEventNote}</>;
  }
  return <div>{renderEmailBounced}</div>;
};
export default EmailBounced;
