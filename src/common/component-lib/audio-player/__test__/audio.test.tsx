import { render, screen, fireEvent } from '@testing-library/react';
import Audio from 'src/common/component-lib/audio-player/components/Audio';

describe('Audio component', () => {
  const mockHandleAudioEnd = jest.fn();
  const fileURL = 'http://example.com/audio.mp3';
  let audioRef;

  beforeEach(() => {
    audioRef = {
      current: {
        play: jest.fn()
      }
    };
  });

  test('Should render audio component without crashing', () => {
    //Act
    render(<Audio fileURL={fileURL} audioRef={audioRef} handleAudioEnd={mockHandleAudioEnd} />);
    //Assert
    expect(screen.getByTestId('audio-element')).toBeInTheDocument();
  });

  test('Should call handleAudioEnd when audio ends', () => {
    //Act
    render(<Audio fileURL={fileURL} audioRef={audioRef} handleAudioEnd={mockHandleAudioEnd} />);
    //Assert
    fireEvent.ended(screen.getByTestId('audio-element'));
    expect(mockHandleAudioEnd).toHaveBeenCalled();
  });
});
