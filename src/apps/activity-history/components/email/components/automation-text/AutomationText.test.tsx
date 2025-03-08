import { render, screen, waitFor } from '@testing-library/react';
import AutomationText from './AutomationText';

describe('Automation Text', () => {
  test('Should render automation text', async () => {
    //Arrange
    render(<AutomationText campaignActivityRecordId="123" />);

    //Assert
    await waitFor(() => {
      expect(screen.getByText('Automation')).toBeInTheDocument();
    });
  });
});
