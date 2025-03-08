import { render, screen } from '@testing-library/react';
import Durations from '../components/Durations';

describe('Durations component', () => {
  test('Should render current time and duration with leading zeros when minutes and seconds are less than 10', () => {
    // Arrange
    const currentTime = { minutes: 3, seconds: 7 };
    const duration = { minutes: 9, seconds: 5 };

    // Act
    render(<Durations currentTime={currentTime} duration={duration} disabled={false} />);

    // Assert
    expect(screen.getByText('03:07')).toBeInTheDocument();
    expect(screen.getByText('09:05')).toBeInTheDocument();
  });

  test('Should render current time and duration without leading zeros when minutes and seconds are 10 or more', () => {
    // Arrange
    const currentTime = { minutes: 10, seconds: 30 };
    const duration = { minutes: 59, seconds: 59 };

    // Act
    render(<Durations currentTime={currentTime} duration={duration} disabled={false} />);

    // Assert
    expect(screen.getByText('10:30')).toBeInTheDocument();
    expect(screen.getByText('59:59')).toBeInTheDocument();
  });

  test('Should render a slash between current time and duration', () => {
    // Arrange
    const currentTime = { minutes: 0, seconds: 0 };
    const duration = { minutes: 0, seconds: 0 };

    // Act
    render(<Durations currentTime={currentTime} duration={duration} disabled={false} />);

    // Assert
    expect(screen.getByText('/')).toBeInTheDocument();
  });
});
