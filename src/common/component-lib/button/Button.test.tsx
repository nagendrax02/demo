import { render, fireEvent, screen } from '@testing-library/react';
import Button from './Button';
import { Variant } from '../../types';

const buttonTestId = 'button-test-id';
describe('Button', () => {
  it('Should render button', () => {
    // Act
    const { getByText } = render(<Button text="Test" onClick={() => {}} />);

    // Assert
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('Should handle click events when button is clicked', () => {
    // Arrange
    const handleClick = jest.fn();
    const { getByText } = render(<Button text="Test" onClick={handleClick} />);

    // Act
    fireEvent.click(getByText('Test'));

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Should render primary button when variant is primary', () => {
    // Act
    render(
      <Button text="Test" onClick={() => {}} variant={Variant.Primary} dataTestId={buttonTestId} />
    );

    // Assert
    expect(screen.getByTestId(buttonTestId)).toHaveClass('primary_variant');
  });

  it('Should render the secondary variant when variant is secondary', () => {
    // Act
    render(
      <Button
        text="Test"
        onClick={() => {}}
        variant={Variant.Secondary}
        dataTestId={buttonTestId}
      />
    );

    // Assert
    expect(screen.getByTestId(buttonTestId)).toHaveClass('secondary_variant');
  });

  it('Should render disabled state button', () => {
    // Act
    render(<Button text="Test" onClick={() => {}} disabled dataTestId={buttonTestId} />);

    // Assert
    expect(screen.getByTestId(buttonTestId)).toBeDisabled();
  });
});
