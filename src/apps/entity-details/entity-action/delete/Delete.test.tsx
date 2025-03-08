import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Delete from '../delete';
import { IDeleteActionHandler } from '../../types/action-handler.types';

jest.mock('@lsq/nextgen-preact/notification/notification.types', () => ({
  Type: {
    SUCCESS: 'success',
    ERROR: 'error'
  }
}));

jest.mock('common/utils/rest-client', () => ({
  Module: { Marvin: 'MARVIN' },
  httpPost: jest.fn(),
  CallerSource: {}
}));

const handleClose = jest.fn();
const mockActionHandler: IDeleteActionHandler = {
  getTitle: () => {
    return 'Delete student';
  },
  getDescription: jest.fn(),
  handleDelete: jest.fn()
};

describe('Delete', () => {
  it('Should render Modal when default props is passed', async () => {
    //Arrange
    render(<Delete handleClose={handleClose} actionHandler={mockActionHandler} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Delete student')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
      expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
    });
  });

  it('Should Close the modal when close button triggered', async () => {
    //Arrange
    render(<Delete handleClose={handleClose} actionHandler={mockActionHandler} />);

    await waitFor(() => {
      //Act
      const closeButton = screen.getByText('No');
      fireEvent.click(closeButton);

      //Assert
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('Should Delete the lead when delete button pressed', async () => {
    //Arrange
    render(<Delete handleClose={handleClose} actionHandler={mockActionHandler} />);

    await waitFor(() => {
      //Act
      const okButton = screen.getByText('Yes, Delete');
      fireEvent.click(okButton);

      //Assert
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
