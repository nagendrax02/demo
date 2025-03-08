import { render, screen, waitFor } from '@testing-library/react';
import Email from '../Email';
import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';

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

describe('Email', () => {
  test('Should render email activities', async () => {
    //Arrange
    render(<Email data={data} entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA} />);

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId('email')).toBeInTheDocument();
    });
  });

  test('Should render email opened activities', async () => {
    //Arrange
    render(
      <Email
        data={{ ...data, ActivityName: 'Email Opened', ActivityEvent: 0 }}
        entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId('email-opened')).toBeInTheDocument();
    });
  });

  test('Should render custom email subscription activities', async () => {
    //Arrange
    render(
      <Email
        data={{ ...data, ActivityName: 'CustomEmail', ActivityEvent: 0 }}
        entityDetailsCoreData={MOCK_ENTITY_DETAILS_CORE_DATA}
      />
    );

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId('custom-email')).toBeInTheDocument();
    });
  });
});
