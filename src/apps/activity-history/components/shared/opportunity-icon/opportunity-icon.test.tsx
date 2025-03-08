import { render, waitFor } from '@testing-library/react';
import OpportunityIcon from './OpportunityIcon';

describe('OpportunityIcon', () => {
  it('Should render opportunity icon', async () => {
    // Act
    const { getByTestId } = render(<OpportunityIcon />);

    // Assert
    await waitFor(() => {
      expect(getByTestId('opportunity-icon')).toBeInTheDocument();
    });
  });
});
