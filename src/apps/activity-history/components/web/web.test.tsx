import { render, screen, waitFor } from '@testing-library/react';
import { ActivityRenderType } from 'apps/activity-history/types';
import Icon from './Icon';

const data = {
  ActivityRenderType: ActivityRenderType.Web,
  ActivityName: '',
  AdditionalDetails: {}
};

describe('Icon', () => {
  const OPPORTUNITY = 'Opportunity';
  const NON_OPPORTUNITY = 'non-opportunity';

  it('Should render OpportunityIcon when ActivityName is OPPORTUNITY', async () => {
    // Arrange
    data.ActivityName = OPPORTUNITY;
    // Act
    render(<Icon data={data} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('opportunity-icon')).toBeInTheDocument();
    });
  });

  it('Should render language icon when ActivityName is not OPPORTUNITY', async () => {
    // Arrange
    data.ActivityName = NON_OPPORTUNITY;
    // Act
    render(<Icon data={data} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('language')).toBeInTheDocument();
    });
  });
});
