import { render, fireEvent, waitFor } from '@testing-library/react';
import Opportunity from './Opportunity';

describe('Opportunity Component', () => {
  const additionalDetails = {
    RelatedActivityId: '123',
    ProspectActivityID: '456',
    RelatedActivityName: 'Sample Opportunity',
    RelatedActivityEvent: '1'
  };

  test('Should render Opportunity component without opportunityId', async () => {
    const { getByText } = render(
      <Opportunity additionalDetails={additionalDetails} activityEvent={2} opportunityId="" />
    );
    await waitFor(() => {
      expect(getByText('Sample Opportunity')).toBeInTheDocument();
    });
  });

  test('Should not render Opportunity component with opportunityId', async () => {
    const { container } = render(
      <Opportunity additionalDetails={additionalDetails} activityEvent={2} opportunityId="789" />
    );

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
