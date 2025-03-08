import { render, screen, waitFor } from '@testing-library/react';
import EmailBounced from './EmailBounced';
import { EMAIL_BOUNCED_TYPES } from 'apps/activity-history/constants';

const data = {
  groupName: 'Aug 2023',
  LeadId: 'e41b4980-7dbd-4494-8041-84cb96092265',
  ActivityDateTime: '2023-08-25 11:53:02',
  ActivityType: 0,
  ActivityEvent: 0,
  ActivityName: 'CustomEmail',
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
    CARUserLastName: 'hello',
    CARUserEmailAddress: 'rakesh.nouvetta@yopmail.com',
    CreatedByName: 'rakesh',
    MXEmail_IsEmailFromOpportunity: 'false',
    MXEmail_ProspectOpportunityId: '',
    MXEmail_OpportunityEventId: '',
    MXEmail_OpportunityName: '',
    ActivityEvent_Note: 'EventNote'
  },
  ActivityRenderType: 0
};

describe('Email Bounced', () => {
  test('Should render email bounced activity', async () => {
    //Arrange
    render(
      <EmailBounced
        data={{
          ...data,
          AdditionalDetails: {
            ...data.AdditionalDetails,
            CampaignActivityType: EMAIL_BOUNCED_TYPES.EMAIL_BOUNCED_WHILE_DELIVERING_SIX
          }
        }}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByText(/Email Address Bounced/)).toBeInTheDocument();
    });
  });

  test('Should render email bounced activity default case', async () => {
    //Arrange
    render(
      <EmailBounced
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
      expect(screen.getByText(/Email Address Bounced EventNote/)).toBeInTheDocument();
    });
  });
});
