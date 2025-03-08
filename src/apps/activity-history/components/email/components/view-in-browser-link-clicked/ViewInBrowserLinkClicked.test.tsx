import { render, screen, waitFor } from '@testing-library/react';
import ViewInBrowserLinkClicked from './ViewInBrowserLinkClicked';
import { VIEW_IN_BROWSER_LINK_CLICKED_TYPES } from 'apps/activity-history/constants';

const data = {
  groupName: 'Aug 2023',
  LeadId: 'e41b4980-7dbd-4494-8041-84cb96092265',
  ActivityDateTime: '2023-08-25 11:53:02',
  ActivityType: 25,
  ActivityEvent: 2001,
  ActivityName: 'EmailSent',
  Id: '60829a8f-a95b-48bb-8509-5e63d00179f3',
  AdditionalDetails: {
    MailMerge:
      '{"MX_CC":"[MXL] <john.smith@acmecorp.com>[MXL]","CC":"<john.smith@acmecorp.com>","MX_BCC":"[MXL]John Smith<john.smith@example.com>[MXL]","BCC":"John Smith<john.smith@example.com>","ReplyTo":"rakesh <rakesh.nouvetta@yopmail.com>"}',
    CampaignActivityType: '8',
    CampaignActivityName: 'Re: A little gift from LSQForms!',
    CampaignActivityId: 'f19e75f6-433d-11ee-aa0f-02eefa84bd20',
    CampaignActivityRecordId: '60829a8f-a95b-48bb-8509-5e63d00179f3',
    EmailSubject: 'Re: A little gift from LSQForms!',
    CARUserFirstName: 'rakesh',
    CARUserLastName: '',
    CARUserEmailAddress: 'rakesh.nouvetta@yopmail.com',
    CreatedByName: 'rakesh',
    MXEmail_IsEmailFromOpportunity: 'false',
    MXEmail_ProspectOpportunityId: '',
    MXEmail_OpportunityEventId: '',
    MXEmail_OpportunityName: ''
  },
  ActivityRenderType: 9
};

describe('View in Browser Link Clicked', () => {
  test('Should render view in browser link clicked activity', async () => {
    //Arrange
    render(
      <ViewInBrowserLinkClicked
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITH_CAMPAIGN_NAME
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(
        screen.getByText(/Clicked on “View in Browser” link of email campaign/)
      ).toBeInTheDocument();
    });
  });

  test('Should render view in browser link clicked activity when campaign activity name is empty', async () => {
    //Arrange
    render(
      <ViewInBrowserLinkClicked
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITH_CAMPAIGN_NAME,
            CampaignActivityName: ''
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(
        screen.getByText(/Clicked on “View in Browser” link of email with subject/)
      ).toBeInTheDocument();
    });
  });

  test('Should render view in browser link clicked campaign activity', async () => {
    //Arrange
    render(
      <ViewInBrowserLinkClicked
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType:
              VIEW_IN_BROWSER_LINK_CLICKED_TYPES.EMAIL_WITHOUT_CAMPAIGN_NAME_SEVEN
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(
        screen.getByText(/Clicked on “View in Browser” link of email with subject/)
      ).toBeInTheDocument();
    });
  });
});
