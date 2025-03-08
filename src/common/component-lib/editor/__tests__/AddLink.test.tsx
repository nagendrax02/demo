import { render, fireEvent } from '@testing-library/react';
import { AddLink } from '../tools';

describe('AddLink', () => {
  const mockSetShow = jest.fn();
  const mockOnSubmit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render component when state is true', () => {
    // Act
    const { getByTestId } = render(<AddLink setShow={mockSetShow} onSubmit={mockOnSubmit} />);

    // Assert
    expect(getByTestId('add-link-container')).toBeInTheDocument();
  });

  it('Should handle outside click', () => {
    // Arrange
    const { container } = render(<AddLink setShow={mockSetShow} onSubmit={mockOnSubmit} />);

    // Act
    fireEvent.click(container);

    // Assert
    expect(mockSetShow).toHaveBeenCalledWith(false);
  });

  it('Should not call onSubmit if link is empty', () => {
    // Arrange
    const { getByText } = render(<AddLink setShow={mockSetShow} onSubmit={mockOnSubmit} />);

    // Act
    fireEvent.click(getByText('Insert'));

    // Assert
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
