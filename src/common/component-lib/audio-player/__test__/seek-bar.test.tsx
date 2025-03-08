import { fireEvent, render } from '@testing-library/react';
import SeekBar from 'src/common/component-lib/audio-player/components/SeekBar';

describe('SeekBar component', () => {
  const mockHandleSeekBar = jest.fn();
  const mockStartTimer = jest.fn();

  test('Should render SeekBar component with default props', () => {
    // Act
    const { getByRole } = render(
      <SeekBar
        disabled={false}
        audioSeekTime={0}
        duration={100}
        handleSeekBar={mockHandleSeekBar}
        startTimer={mockStartTimer}
        className=""
      />
    );

    // Assert
    expect(getByRole('slider')).toBeInTheDocument();
  });

  test('Should handle onInput event', () => {
    // Act
    const { getByRole } = render(
      <SeekBar
        disabled={false}
        audioSeekTime={0}
        duration={100}
        handleSeekBar={mockHandleSeekBar}
        startTimer={mockStartTimer}
        className=""
      />
    );

    // Assert
    fireEvent.input(getByRole('slider'), { target: { value: '50' } });
    expect(mockHandleSeekBar).toHaveBeenCalled();
  });

  test('Should handle onMouseUp event', () => {
    // Act
    const { getByRole } = render(
      <SeekBar
        disabled={false}
        audioSeekTime={0}
        duration={100}
        handleSeekBar={mockHandleSeekBar}
        startTimer={mockStartTimer}
        className=""
      />
    );

    // Assert
    fireEvent.mouseUp(getByRole('slider'));
    expect(mockStartTimer).toHaveBeenCalledWith(true);
  });

  test('Should handle onKeyUp event', () => {
    // Act
    const { getByRole } = render(
      <SeekBar
        disabled={false}
        audioSeekTime={0}
        duration={100}
        handleSeekBar={mockHandleSeekBar}
        startTimer={mockStartTimer}
        className=""
      />
    );

    // Assert
    fireEvent.keyUp(getByRole('slider'));
    expect(mockStartTimer).toHaveBeenCalledWith(true);
  });

  test('Should set backgroundSize style based on audioSeekTime and duration', () => {
    // Arrange
    const mockHandleSeekBar = jest.fn();
    const mockStartTimer = jest.fn();

    const { getByRole } = render(
      <SeekBar
        disabled={false}
        audioSeekTime={50}
        duration={100}
        handleSeekBar={mockHandleSeekBar}
        startTimer={mockStartTimer}
        className=""
      />
    );

    // Act
    const slider = getByRole('slider');

    // Assert
    expect(slider).toHaveStyle('background-size: 50% 100%');
  });
});
