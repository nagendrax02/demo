import { render, fireEvent, screen } from '@testing-library/react';
import VolumeControl from 'src/common/component-lib/audio-player/components/VolumeControl';

describe('VolumeControl component', () => {
  let audioRef;

  beforeEach(() => {
    audioRef = {
      current: {
        volume: 1
      }
    };
  });

  test('Should render with VolumeControl component', () => {
    // Act
    render(<VolumeControl audioRef={audioRef} className="" disabled={false} />);

    // Assert
    const volumeSlider = screen.getByRole('slider');
    expect(volumeSlider).toHaveValue('100');
  });

  test('Should change volume when slider is adjusted', () => {
    // Act
    render(<VolumeControl audioRef={audioRef} className="" disabled={false} />);
    const volumeSlider = screen.getByRole('slider');
    fireEvent.change(volumeSlider, { target: { value: '50' } });

    // Assert
    expect(audioRef.current.volume).toBe(0.5);
  });

  test('Should mutes/unmutes volume when volume button is clicked', () => {
    // Act
    render(<VolumeControl audioRef={audioRef} className="" disabled={false} />);
    const volumeButton = screen.getByRole('button');
    fireEvent.click(volumeButton);
    expect(audioRef.current.volume).toBe(0);
    fireEvent.click(volumeButton);

    // Assert
    expect(audioRef.current.volume).toBe(1);
  });
});
