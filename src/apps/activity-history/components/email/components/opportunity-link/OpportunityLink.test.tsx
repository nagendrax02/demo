import { fireEvent, render, screen } from '@testing-library/react';
import OpportunityLink from './OpportunityLink';

const data = {
  groupName: 'Sep 2023',
  LeadId: 'cc9aa6ac-4c5e-4adc-9e62-fc9d1be001c4',
  ActivityDateTime: '2023-09-07 07:44:44',
  SystemDate: '2023-09-07 07:50:17',
  ActivityEvent: 10,
  ActivityName: 'Email Bounced',
  Id: '30194c23-4d53-11ee-97a9-02dbc66f3266',
  AdditionalDetails: {
    ModifiedOn: '2023-09-07 07:50:17',
    CreatedBy: '6e798423-8fde-11e8-aa96-0258598489d8',
    LSType: '0',
    TrackLocation: '0',
    ActivityScore: '-10',
    ActivityEvent_Note:
      'Notified HardBounce(EmailId : muskansu.9695@mailinator.com,Reason : 554 Invalid Email) by EmailServiceProvider at 2023-09-07 07:44:44(UTC) for Email: retee',
    ActivityEventCount: '1',
    StatusReason: '',
    NotableEventDescription:
      'Notified HardBounce(EmailId : muskansu.9695@mailinator.com,Reason : 554 Invalid Email) by EmailServiceProvider at 2023-09-07 07:44:44(UTC) for Email: retee',
    Activity_Web_PageTitle: '',
    Activity_Web_PageURL: '',
    TimeSpent: '1',
    IsLandingPage: '1',
    SessionID: '30194c23-4d53-11ee-97a9-02dbc66f3266',
    TrafficSource: '',
    EnableActivityDetails: '0',
    Latitude: '',
    Longitude: '',
    Address: '',
    Country: '',
    State: '',
    City: '',
    WebContentName: '',
    WebPublishedURL: '',
    WebContentId: '',
    WebContentStatusCode: '',
    MailMerge:
      '{"MailMerge_ProspectOpportunityId":"43a5f068-0ef5-4535-a000-3ccf1a2e3a07","MX_CC":"[MXL] <muskan.sgp@lsqdev.in>[MXL]","CC":"<muskan.sgp@lsqdev.in>","MX_BCC":"[MXO]muskansu <muskansu.9695@mailinator.com>[MXO]","BCC":"LeadOwner"}',
    CampaignActivityType: '8',
    CampaignActivityName: 'retee',
    CampaignActivityId: '64e22514-4d52-11ee-97a9-02dbc66f3266',
    CampaignActivityRecordId: '9cc3c77c-cc24-4862-924f-b9f30065d397',
    EmailSubject: 'retee',
    ActivityUserFirstName: 'System',
    ActivityUserLastName: '',
    CARUserFirstName: 'muskan',
    CARUserLastName: '',
    CARUserEmailAddress: 'muskan.9695@mailinator.com',
    CreatedByName: 'System',
    HasAttachments: '0',
    mxLangSelector: '₹',
    ActivityEntityType: 'Activity',
    RelatedActivityId: '',
    RelatedProspectActivityAutoId: '',
    ProspectActivityAutoId: '2445434',
    RelatedActivityName: '',
    RelatedActivityEvent: '',
    RelatedActivityEntityType: 'Activity',
    RelatedActivityOwner: '',
    OpportunityName: '',
    Owner: '6e798423-8fde-11e8-aa96-0258598489d8',
    MXEmail_IsEmailFromOpportunity: 'true',
    MXEmail_ProspectOpportunityId: '43a5f068-0ef5-4535-a000-3ccf1a2e3a07',
    MXEmail_OpportunityEventId: '12064',
    MXEmail_OpportunityName: 'Nancy hb - 1 KJ Somaiya College of Education'
  },
  ActivityRenderType: 9
};

describe('Opportunity Link', () => {
  test('Should render opportunity link', () => {
    //Arrange
    render(<OpportunityLink data={data} />);

    //Act
    fireEvent.click(screen.getByTestId('opp-link'));

    //Assert
    expect(screen.getByText(/Nancy hb - 1 KJ Somaiya College of Education/)).toBeInTheDocument();
  });

  test('Should not render opportunity link when opportunity id or name is empty', () => {
    //Arrange
    const { container } = render(
      <OpportunityLink
        data={{
          ...data,
          AdditionalDetails: { ...data?.AdditionalDetails, MXEmail_OpportunityName: '' }
        }}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
