import { render, fireEvent } from '@testing-library/react';
import IconButton from './IconButton';

describe('IconButton', () => {
  it('Should render icon button', () => {
    // Act
    const { getByRole } = render(<IconButton onClick={() => {}} icon={<div />} />);

    // Assert
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('Should handle click events when button is clicked', () => {
    // Arrange
    const handleClick = jest.fn();
    const { getByRole } = render(<IconButton onClick={handleClick} icon={<div />} />);

    // Act
    fireEvent.click(getByRole('button'));

    // Assert
    expect(handleClick).toHaveBeenCalled();
  });

  it('Should render icon when it is passed', () => {
    // Act
    const { getByTestId } = render(
      <IconButton onClick={() => {}} icon={<div data-testid="icon" />} />
    );

    // Assert
    expect(getByTestId('icon')).toBeInTheDocument();
  });

  it('Should apply custom styles when passed', () => {
    // Act
    const { getByRole } = render(
      <IconButton onClick={() => {}} icon={<div />} customStyleClass="custom-class" />
    );

    // Assert
    expect(getByRole('button')).toHaveClass('custom-class');
  });

  it('Should render disabled state icon button', () => {
    // Act
    const { getByRole } = render(<IconButton onClick={() => {}} icon={<div />} disabled />);

    // Assert
    expect(getByRole('button')).toBeDisabled();
  });
});
