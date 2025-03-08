import { act, render, screen, waitFor } from '@testing-library/react';
import ControlledTooltip from './ControlledTooltip';

describe('ControlledTooltip', () => {
  it('Should render tooltip content when show is true', () => {
    // Act
    act(() => {
      render(
        <ControlledTooltip content="Tooltip Content" show={true}>
          <button>Hover me</button>
        </ControlledTooltip>
      );
    });

    // Assert
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument();
  });

  it('Should not render tooltip content when show is false', () => {
    // Act
    act(() => {
      render(
        <ControlledTooltip content="Tooltip Content" show={false}>
          <button>Hover me</button>
        </ControlledTooltip>
      );
    });

    // Assert
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
  });

  it('Should auto-close the tooltip after the specified interval', async () => {
    // Arrange
    jest.useFakeTimers();

    // Act
    act(() => {
      render(
        <ControlledTooltip content="Tooltip Content" show={true} autoCloseInterval={1000}>
          <button>Hover me</button>
        </ControlledTooltip>
      );
    });

    // Assert
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument();

    // Act
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
    });
  });

  it('Should call onClose callback when tooltip auto-closes', async () => {
    // Arrange
    jest.useFakeTimers();
    const onCloseMock = jest.fn();

    // Act
    act(() => {
      render(
        <ControlledTooltip
          content="Tooltip Content"
          show={true}
          autoCloseInterval={1000}
          onClose={onCloseMock}>
          <button>Hover me</button>
        </ControlledTooltip>
      );
    });

    // Act
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Assert
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
