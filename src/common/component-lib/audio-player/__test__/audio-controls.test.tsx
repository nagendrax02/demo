import { render, fireEvent, screen } from '@testing-library/react';
import AudioControls from 'common/component-lib/audio-player/components/AudioControls';

describe('AudioControls component', () => {
  // Arrange
  const handlePlayMock = jest.fn();

  it('Should render play button when audio is not playing', () => {
    // Act
    render(<AudioControls isPlaying={false} handlePlay={handlePlayMock} />);

    // Assert
    const playButton = screen.getByRole('button', { name: 'Play the audio' });
    expect(playButton).toBeInTheDocument();
    expect(screen.getByText('play_arrow')).toBeInTheDocument();
  });

  it('Should render pause button when audio is playing', () => {
    // Act
    render(<AudioControls isPlaying={true} handlePlay={handlePlayMock} />);

    // Assert
    const pauseButton = screen.getByRole('button', { name: 'Pause the audio' });
    expect(pauseButton).toBeInTheDocument();
    expect(screen.getByText('pause')).toBeInTheDocument();
  });

  it('Should call handlePlay when button is clicked', () => {
    // Act
    render(<AudioControls isPlaying={false} handlePlay={handlePlayMock} />);

    // Assert
    const playButton = screen.getByRole('button', { name: 'Play the audio' });
    fireEvent.click(playButton);
    expect(handlePlayMock).toHaveBeenCalledTimes(1);
  });
});
