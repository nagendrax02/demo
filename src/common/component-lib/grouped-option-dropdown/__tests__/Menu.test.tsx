import { render, fireEvent, waitFor } from '@testing-library/react';
import Menu from '../menu';

describe('Menu', () => {
  const mockOnOptionSelect = jest.fn();

  const props = {
    searchText: '',
    options: [{ label: 'test Option', value: 'test1', group: 'A' }],
    groupConfig: {
      ['A']: {
        displayName: 'A'
      }
    },
    onOptionSelect: mockOnOptionSelect,
    selectedOpts: []
  };

  it('Should render component when mounted', async () => {
    // Act
    const { getByTestId } = render(<Menu {...props} />);

    // Assert
    await waitFor(() => {
      expect(getByTestId('grouped-option-dropdown-menu')).toBeInTheDocument();
    });
  });

  it('Should call option select function on option click', async () => {
    // Arrange
    const { getByText } = render(<Menu {...props} />);
    const option = getByText('test Option');

    // Act
    fireEvent.click(option);

    // Assert
    await waitFor(() => {
      expect(mockOnOptionSelect).toHaveBeenCalled();
    });
  });

  it('Should display loading message when loading state is true', () => {
    // Act
    const { getByText } = render(<Menu {...props} isOptionLoading={true} />);

    // Assert
    expect(getByText('Fetching Values')).toBeInTheDocument();
  });
});
