import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Link from './Link';

describe('Link', () => {
  test('Should renders Link component when link is passed as props', async () => {
    //Arrange
    render(<Link link="https://www.google.com" />);

    //Assert
    await waitFor(() => {
      expect(screen.getByText('https://www.google.com')).toBeInTheDocument();
    });
  });
});
