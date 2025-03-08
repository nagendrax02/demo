import { render, fireEvent } from '@testing-library/react';
import Email from './Email';

describe('Email', () => {
  it('Should render emailId', () => {
    // Act
    const { getByText } = render(<Email emailId="test@example.com" />);
    // Assert
    expect(getByText('test@example.com')).toBeInTheDocument();
  });

  it('Should handle click when email is not disabled', () => {
    // Arrange
    const handleClick = jest.fn();
    const { getByText } = render(<Email emailId="test@example.com" onClick={handleClick} />);

    // Act
    fireEvent.click(getByText('test@example.com'));

    // Assert
    expect(handleClick).toHaveBeenCalled();
  });

  it('Should handle click when email is disabled', () => {
    // Arrange
    const handleClick = jest.fn();
    const { getByText } = render(
      <Email emailId="test@example.com" onClick={handleClick} disabled />
    );

    // Act
    fireEvent.click(getByText('test@example.com'));

    // Assert
    expect(handleClick).not.toHaveBeenCalled();
  });
});
