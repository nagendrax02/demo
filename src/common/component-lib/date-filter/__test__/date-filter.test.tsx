import { render, waitFor, screen } from '@testing-library/react';
import DateFilter from '../DateFilter';

const mockData = {
  selectedValue: { value: 'today', label: 'Today' },
  startDate: null,
  endDate: null,
  setSelectedValue: jest.fn(),
  setStartDate: jest.fn(),
  setEndDate: jest.fn(),
  resetCustomDate: jest.fn()
};

const setSelectedOption = jest.fn();

const today = { value: 'today', label: 'Today', startDate: '2023-01-01', endDate: '2023-01-31' };
const custom = { value: 'custom', label: 'Custom', startDate: '2023-01-01', endDate: '2023-01-31' };

describe('DateFilter component', () => {
  it('Should render the component with default values', async () => {
    // Act
    render(<DateFilter selectedOption={today} setSelectedOption={setSelectedOption} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  it('Should render custom date picker when selected option is Custom', async () => {
    // Arrange
    mockData.selectedValue = { value: 'custom', label: 'Custom' };

    // Act
    render(<DateFilter selectedOption={custom} setSelectedOption={setSelectedOption} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('range-picker')).toBeInTheDocument();
    });
  });
});
