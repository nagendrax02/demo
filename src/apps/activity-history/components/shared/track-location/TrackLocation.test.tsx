import { render, screen, waitFor } from '@testing-library/react';
import TrackLocation from './TrackLocation';

describe('Track Location', () => {
  test('Should render track location', async () => {
    //Arrange
    render(<TrackLocation latitude="1" longitude="2" />);

    //Assert
    waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});
