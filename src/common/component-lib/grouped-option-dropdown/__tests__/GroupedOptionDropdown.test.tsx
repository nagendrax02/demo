import { render, fireEvent, waitFor } from '@testing-library/react';
import GroupedOptionDropdown from '../GroupedOptionDropdown';

describe('GroupedOptionDropdown', () => {
  const mockFetchOptions = jest.fn();
  const mockOnOptionSelect = jest.fn();
  const mockOnOptionClear = jest.fn();

  const props = {
    fetchOptions: mockFetchOptions,
    onOptionSelect: mockOnOptionSelect,
    onOptionClear: mockOnOptionClear,
    groupConfig: {},
    selectedOptions: []
  };

  it('Should render component when mounted', async () => {
    // Act
    const { getByTestId } = render(<GroupedOptionDropdown {...props} />);

    // Assert
    await waitFor(() => {
      expect(getByTestId('grouped-option-dropdown')).toBeInTheDocument();
    });
  });

  it('Should call fetchOptions when search text is updated', async () => {
    // Arrange
    const { getByPlaceholderText } = render(
      <GroupedOptionDropdown {...props} placeholder="Test Search" />
    );
    const input = getByPlaceholderText('Test Search');

    // Act
    fireEvent.change(input, { target: { value: 'test' } });

    // Assert
    await waitFor(() => {
      expect(mockFetchOptions).toHaveBeenCalled();
    });
  });
});
