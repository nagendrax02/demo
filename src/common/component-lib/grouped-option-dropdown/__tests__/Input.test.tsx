import { render, fireEvent, waitFor } from '@testing-library/react';
import Input from '../input';

describe('Input', () => {
  const mockOnOptionClear = jest.fn();
  const mockOnInputChange = jest.fn();

  const props = {
    searchText: '',
    selectedOptions: [],
    groupConfig: {},
    onOptionClear: mockOnOptionClear,
    onInputChange: mockOnInputChange
  };

  it('Should render component when mounted', async () => {
    // Act
    const { getByTestId } = render(<Input {...props} />);

    // Assert
    await waitFor(() => {
      expect(getByTestId('grouped-option-dropdown-input')).toBeInTheDocument();
    });
  });

  it('Should call input change function', async () => {
    // Arrange
    const { getByPlaceholderText } = render(<Input {...props} placeholder="Test Search" />);
    const input = getByPlaceholderText('Test Search');

    // Act
    fireEvent.change(input, { target: { value: 'test' } });

    // Assert
    await waitFor(() => {
      expect(mockOnInputChange).toHaveBeenCalledWith('test');
    });
  });
});
