import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OptOut from './OptOut';

// Arrange;
jest.mock('@lsq/nextgen-preact/notification/notification.types', () => ({
  Type: {
    SUCCESS: 'success',
    ERROR: 'error'
  }
}));

jest.mock('src/common/utils/rest-client', () => ({
  Module: {
    Marvin: 'MARVIN'
  },
  httpPost: jest.fn(() => Promise.resolve({})),
  CallerSource: {}
}));

const leadId = '980a3a4a-3d4c-416f-acc5-794e419b8638';
const name = 'student';
const handleClose = jest.fn();

describe('OptOut', () => {
  it('Should render Modal when default props is passed', async () => {
    //Arrange
    render(<OptOut leadId={leadId} leadRepresent={name} handleClose={handleClose} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Reason')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
      expect(screen.getByText('Ok')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('Should handles message change when textarea value changed', async () => {
    //Arrange
    const { getByPlaceholderText } = render(
      <OptOut leadId="123" leadRepresent="John Doe" handleClose={handleClose} />
    );

    await waitFor(() => {
      //Act
      const textarea = getByPlaceholderText('Enter text') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Opting out for a reason' } });

      // Assert
      expect(textarea.value).toBe('Opting out for a reason');
    });
  });

  it('Should Close the modal when close button tiggered', async () => {
    //Arrange
    render(<OptOut leadId="123" leadRepresent="John Doe" handleClose={handleClose} />);

    await waitFor(() => {
      //Act
      const closeButton = screen.getByText('Cancel');
      fireEvent.click(closeButton);

      //Assert
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('Should show Success Notification when submit API passed', async () => {
    //Arrange
    const { getByPlaceholderText } = render(
      <OptOut leadId="123" leadRepresent="John Doe" handleClose={handleClose} />
    );

    await waitFor(() => {
      //Act
      const textarea = getByPlaceholderText('Enter text') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Opting out for a reason' } });

      const okButton = screen.getByText('Ok');
      fireEvent.click(okButton);

      //Assert
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
