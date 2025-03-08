import { render, screen, waitFor } from '@testing-library/react';
import EmailSent from './EmailSent';
import { EMAIL_SENT_TYPES } from 'src/apps/activity-history/constants';

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

describe('Email sent', () => {
  test('Should render email sent activity', async () => {
    //Arrange
    render(
      <EmailSent
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_SENT_TYPES.SENT_WITH_SUBJECT
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByText(/Sent email with subject/)).toBeInTheDocument();
    });
  });

  test('Should render email sent activity with user name', async () => {
    //Arrange
    render(
      <EmailSent
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_SENT_TYPES.SENT_WITH_SUBJECT_USER_EMAIL
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByText(/rakesh/)).toBeInTheDocument();
    });
  });

  test('Should render notification email sent activity', async () => {
    //Arrange
    render(
      <EmailSent
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_SENT_TYPES.SENT_NOTIFICATION_EMAIL
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByText(/Sent notification email with subject/)).toBeInTheDocument();
    });
  });

  test('Should render sent email through email client activity', async () => {
    //Arrange
    render(
      <EmailSent
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_SENT_TYPES.SENT_EMAIL_THROUGH_EMAIL_CLIENT
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByText(/Sent email through Email Client with subject/)).toBeInTheDocument();
    });
  });

  test('Should render sent referral campaign email with subject activity', async () => {
    //Arrange
    render(
      <EmailSent
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_SENT_TYPES.SENT_REFERRAL_CAMPAIGN_EMAIL
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByText(/Sent Referral Campaign email with subject/)).toBeInTheDocument();
    });
  });

  test('Should render email sent via automation activity', async () => {
    //Arrange
    render(
      <EmailSent
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_SENT_TYPES.SENT_AUTOMATION_EMAIL
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByText(/Automation/)).toBeInTheDocument();
    });
  });

  test('Should render default email sent activity', async () => {
    //Arrange
    render(
      <EmailSent
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: '-1'
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByText(/EmailSent/)).toBeInTheDocument();
    });
  });
});
