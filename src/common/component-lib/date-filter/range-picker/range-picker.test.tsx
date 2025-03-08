import { render, screen, fireEvent } from '@testing-library/react';
import RangePicker from './RangePicker';
import StartDatePicker from './StartDatePicker';
import EndDatePicker from './EndDatePicker';

// Arrange
jest.mock('common/component-lib/date-time', () => {
  return {
    __esModule: true,
    LazyDatePicker: ({ value, onChange, minDate, maxDate }) => (
      <input
        type="date"
        data-testid="date-picker"
        value={value.toISOString().split('T')[0]}
        onChange={onChange}
        min={minDate?.toISOString().split('T')[0]}
        max={maxDate?.toISOString().split('T')[0]}
      />
    )
  };
});

const mockProps = {
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-01-31'),
  setStartDate: jest.fn(),
  setEndDate: jest.fn()
};

describe('CustomDatePicker', () => {
  it('Should render CustomDatePicker with StartDatePicker and EndDatePicker', () => {
    // Act
    render(<RangePicker {...mockProps} />);

    // Assert
    expect(screen.getByTestId('start-date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('end-date-picker')).toBeInTheDocument();
  });
});

describe('StartDatePicker', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Should render StartDatePicker with correct props', () => {
    // Act
    render(<StartDatePicker {...mockProps} />);

    // Assert
    expect(screen.getByTestId('date-picker')).toHaveAttribute('value', '2023-01-01');
  });

  it('Should call setStartDate when the date changes', () => {
    // Act
    render(<StartDatePicker {...mockProps} />);
    const datePicker = screen.getByTestId('date-picker');

    fireEvent.change(datePicker, { target: { value: '2023-01-10' } });

    // Assert
    expect(mockProps.setStartDate).toHaveBeenCalled();
  });
});

describe('EndDatePicker', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render EndDatePicker with correct props', () => {
    // Act
    render(<EndDatePicker {...mockProps} />);
    const datePicker = screen.getByTestId('date-picker');

    // Assert
    expect(datePicker).toHaveAttribute('value', '2023-01-31');
    expect(datePicker).toHaveAttribute('min', '2023-01-01');
  });

  it('Should call setEndDate when the date changes', () => {
    // Act
    render(<EndDatePicker {...mockProps} />);
    const datePicker = screen.getByTestId('date-picker');

    fireEvent.change(datePicker, { target: { value: '2023-02-15' } });
    // Assert
    expect(mockProps.setEndDate).toHaveBeenCalled();
  });
});
