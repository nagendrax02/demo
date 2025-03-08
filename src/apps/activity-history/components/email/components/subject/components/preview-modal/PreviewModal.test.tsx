import { render, screen, waitFor } from '@testing-library/react';
import PreviewModal from './PreviewModal';

const additionalDetails = {
  MailMerge:
    '{"@{Account:CompanyName ,}":"nouvetta ABCDEFGHIJKLMNOPQRSTUVWXYZ 123456789","MX_CC":"[MXU]Abhishek Jalan<rohitdtest@mailinator.com>[MXU][MXO]muskansu <muskansu.9695@mailinator.com>[MXO][MXL]chinta <hello@asdsdasdsd.com>[MXL][MXL]rohit <rohit17@mailinator.com>[MXL]","CC":"Abhishek Jalan; LeadOwner; chinta <hello@asdsdasdsd.com>; rohit <rohit17@mailinator.com>","MX_BCC":"[MXU]Rohith <rohith.9695nouvetta@mailinator.com>[MXU][MXU]rohit9695 <rohit9695@mailinator.com>[MXU][MXM]abhi 9695<abhi.9695@mailinator.com>[MXM][MXL]John Doe<rohith.gb@leadsquared.com>[MXL]","BCC":"Rohith ; rohit9695 ; LeadOwnerManager; John Doe<rohith.gb@leadsquared.com>"}',
  CampaignActivityType: '8',
  CampaignActivityName: 'A little gift from @{Account:CompanyName ,}!',
  CampaignActivityId: '0a5560b6-a582-11ee-9a2a-02eefa84bd20',
  CampaignActivityRecordId: '182942a4-31e7-4cc9-9386-77dc390fded8',
  EmailSubject: 'A little gift from nouvetta ABCDEFGHIJKLMNOPQRSTUVWXYZ 123456789!',
  CARUserFirstName: 'Rohith',
  CARUserLastName: '',
  CARUserEmailAddress: 'rohith.9695nouvetta@mailinator.com',
  CreatedByName: 'Rohith',
  MXEmail_IsEmailFromOpportunity: 'false',
  MXEmail_ProspectOpportunityId: '',
  MXEmail_OpportunityEventId: '',
  MXEmail_OpportunityName: ''
};

describe('Preview Modal', () => {
  test('Should render email preview', async () => {
    //Arrange
    const show = true;
    const setShow = jest.fn();
    render(<PreviewModal show={show} setShow={setShow} additionalDetails={additionalDetails} />);

    //Assert
    await waitFor(() => {
      expect(screen.getByTestId('close-preview-modal')).toBeInTheDocument();
    });
  });
});
