import { render, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import SelectedOptionRenderer from '../input/SelectedOptionRenderer';

describe('SelectedOptionRenderer', () => {
  const mockOnOptionClear = jest.fn();

  const props = {
    options: [{ label: 'test Option', value: 'test1', group: 'A' }],
    groupConfig: {
      ['A']: {
        displayName: 'A'
      }
    },
    onOptionClear: mockOnOptionClear
  };

  it('Should render component when mounted', async () => {
    // Act
    const { getByTestId } = render(<SelectedOptionRenderer {...props} />);

    // Assert
    await waitFor(() => {
      expect(getByTestId('grouped-option-dropdown-selected-option')).toBeInTheDocument();
    });
  });

  it('Should call clear option function when clear icon is clicked', async () => {
    // Arrange
    const { getByTestId } = render(<SelectedOptionRenderer {...props} />);
    const optionClearButton = getByTestId('grouped-option-dropdown-clear-option');

    // Act
    fireEvent.click(optionClearButton);

    // Assert
    await waitFor(() => {
      expect(mockOnOptionClear).toHaveBeenCalled();
    });
  });
});
