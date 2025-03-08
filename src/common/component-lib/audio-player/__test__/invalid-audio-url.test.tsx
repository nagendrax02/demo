import { render, screen } from '@testing-library/react';
import InvalidAudioURL from '../components/InvalidAudioURL';

describe('InvalidAudioURL component', () => {
  test('Should display a warning icon', () => {
    // Act
    render(<InvalidAudioURL />);

    // Assert
    expect(screen.getByText('warning')).toBeInTheDocument();
  });

  test('Should display the "Unable to retrieve audio" warning message text', () => {
    // Act
    render(<InvalidAudioURL />);

    // Assert
    expect(screen.getByText('Unable to retrieve audio')).toBeInTheDocument();
  });
});
