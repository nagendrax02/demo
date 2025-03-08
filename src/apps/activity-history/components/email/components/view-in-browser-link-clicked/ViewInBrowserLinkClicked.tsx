import { IAugmentedAHDetail } from 'apps/activity-history/types';
import { VIEW_IN_BROWSER_LINK_CLICKED_TYPES } from 'apps/activity-history/constants';
import { getViewInBrowserLinkClickedText } from './utils';
import Subject from '../subject';
import AutomationText from '../automation-text';

export interface IViewInBrowserLinkClicked {
  data: IAugmentedAHDetail;
}
// eslint-disable-next-line complexity
const ViewInBrowserLinkClicked = ({ data }: IViewInBrowserLinkClicked): JSX.Element => {
  const { AdditionalDetails } = data;
  const subject = AdditionalDetails?.EmailSubject || '';
  const campaignActivityType = AdditionalDetails?.CampaignActivityType;
  const campaignActivityName = AdditionalDetails?.CampaignActivityName;
  const campaignActivityRecordId = AdditionalDetails?.CampaignActivityRecordId;
  let renderViewInBrowserLinkClicked = <></>;

  switch (campaignActivityType) {
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITH_CAMPAIGN_NAME:
      renderViewInBrowserLinkClicked = (
        <>
          {getViewInBrowserLinkClickedText(campaignActivityType, campaignActivityName || '')}{' '}
          {subject}
        </>
      );
      break;
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_ONE:
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_THREE:
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_FOUR:
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_SIX:
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_SEVEN:
      renderViewInBrowserLinkClicked = (
        <>
          {getViewInBrowserLinkClickedText(campaignActivityType, campaignActivityName || '')}{' '}
          <Subject additionalDetails={AdditionalDetails} />
        </>
      );
      break;
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_TWELVE:
      /* istanbul ignore next */
      renderViewInBrowserLinkClicked = (
        <>
          Clicked on “View in Browser” link of{' '}
          <AutomationText campaignActivityRecordId={campaignActivityRecordId} />{' '}
          <Subject additionalDetails={AdditionalDetails} />
        </>
      );
      break;
    /* istanbul ignore next */
    default:
      renderViewInBrowserLinkClicked = <>View in Browser Link Clicked Activities</>;
  }

  return <div>{renderViewInBrowserLinkClicked}</div>;
};

export default ViewInBrowserLinkClicked;
