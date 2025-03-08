import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Subject from '../Subject';

describe('Subject', () => {
  test('Should render subject', async () => {
    //Arrange
    render(<Subject additionalDetails={{}} />);
    const subjectEl = screen.getByTestId('email-subject');

    //Act
    fireEvent.click(subjectEl);

    //Assert
    await waitFor(() => {
      expect(subjectEl).toBeInTheDocument();
    });
  });
});
