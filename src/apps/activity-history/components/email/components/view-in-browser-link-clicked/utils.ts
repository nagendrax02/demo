import { VIEW_IN_BROWSER_LINK_CLICKED_TYPES } from 'apps/activity-history/constants';

const getViewInBrowserLinkClickedText = (
  campaignActivityType: string,
  campaignActivityName: string
): string => {
  /* istanbul ignore next */
  switch (campaignActivityType) {
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITH_CAMPAIGN_NAME:
      if (campaignActivityName) {
        return `Clicked on “View in Browser” link of email campaign ${campaignActivityName} with subject`;
      }
      return `Clicked on “View in Browser” link of email with subject`;
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_ONE:
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_FOUR:
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_SIX:
    case VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_SEVEN:
      return `Clicked on “View in Browser” link of email with subject`;
    default:
      /* istanbul ignore next */
      return '';
  }
};

export { getViewInBrowserLinkClickedText };
