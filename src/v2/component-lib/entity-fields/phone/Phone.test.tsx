import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Phone from './Phone';

//Arrange
const number = '1234567890';

describe('Phone', () => {
  test('Should render phone number as plain text when do not call is enabled', async () => {
    //Act
    render(<Phone number={number} doNotCall />);
    //Assert

    await waitFor(() => {
      expect(screen.getByTestId('phone-with-do-not-call')).toBeInTheDocument();
      expect(screen.getByText(number)).toBeInTheDocument();
    });
  });

  test('Should render phone number as clickable when do not call is not enabled.', () => {
    //Act
    render(<Phone number={number} doNotCall={false} />);
    //Assert
    expect(screen.getByTestId('phone')).toBeInTheDocument();
    expect(screen.getByText(number)).toBeInTheDocument();
  });

  test('Should invoke handlePhoneNumberClick when phone number is clicked and do not call is not enabled', () => {
    //Act
    const handlePhoneNumberClick = jest.fn();
    render(<Phone number={number} doNotCall={false} onClick={handlePhoneNumberClick} />);

    //Arrange
    fireEvent.click(screen.getByTestId('phone'));

    //Assert
    expect(handlePhoneNumberClick).toHaveBeenCalledTimes(1);
  });

  test('Should not invoke handlePhoneNumberClick when phone number is clicked and do not call is enabled', () => {
    //Act
    const handlePhoneNumberClick = jest.fn();
    render(<Phone number={number} doNotCall onClick={handlePhoneNumberClick} />);

    //Arrange
    fireEvent.click(screen.getByTestId('phone-with-do-not-call'));

    //Assert
    expect(handlePhoneNumberClick).toHaveBeenCalledTimes(0);
  });
});
