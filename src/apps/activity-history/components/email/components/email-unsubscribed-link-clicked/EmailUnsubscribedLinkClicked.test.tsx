import { render, screen, waitFor } from '@testing-library/react';
import EmailUnsubscribedLinkClicked from './EmailUnsubscribedLinkClicked';
import { EMAIL_UNSUBSCRIBE_TYPES } from 'apps/activity-history/constants';

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

describe('Email Unsubscribed Link Clicked', () => {
  test('Should render email unsubscribed link clicked activity', async () => {
    //Arrange
    render(
      <EmailUnsubscribedLinkClicked
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_UNSUBSCRIBE_TYPES.EMAIL_CAMPAIGN
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(
        screen.getByText(/Clicked on unsubscribe link from email Campaign/)
      ).toBeInTheDocument();
    });
  });

  test('Should render email unsubscribed link clicked activity when campaign activity name is empty', async () => {
    //Arrange
    render(
      <EmailUnsubscribedLinkClicked
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_UNSUBSCRIBE_TYPES.EMAIL_CAMPAIGN,
            CampaignActivityName: ''
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(
        screen.getByText(/Clicked on unsubscribe link from email with subject/)
      ).toBeInTheDocument();
    });
  });

  test('Should render email unsubscribed link clicked referral activity', async () => {
    //Arrange
    render(
      <EmailUnsubscribedLinkClicked
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_UNSUBSCRIBE_TYPES.REFERRAL_EMAIL,
            CampaignActivityName: ''
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(
        screen.getByText(/Clicked on unsubscribe link from email with subject/)
      ).toBeInTheDocument();
    });
  });

  test('Should render email unsubscribed link clicked automation activity', async () => {
    //Arrange
    render(
      <EmailUnsubscribedLinkClicked
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_UNSUBSCRIBE_TYPES.AUTOMATION_EMAIL,
            CampaignActivityName: ''
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByText(/Automation/)).toBeInTheDocument();
    });
  });
});
