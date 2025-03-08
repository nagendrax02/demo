import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MediaLink from './MediaLink';
import { shouldEnableDownload } from '../audio-player/utils';

const setModalContent = jest.fn();
const setInitialPosition = jest.fn();

jest.mock('common/component-lib/media-modal/media.store', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setModalContent,
    setInitialPosition
  }))
}));

jest.mock('@lsq/nextgen-preact/tooltip', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
  Placement: {
    Vertical: 'Vertical'
  },
  Trigger: {
    Hover: 'Hover'
  }
}));

jest.mock('common/types', () => ({
  __esModule: true,
  Theme: {
    Dark: 'Dark'
  }
}));
jest.mock('../audio-player/utils', () => ({
  shouldEnableDownload: jest.fn(() => false)
}));

describe('MediaLink Component', () => {
  const fileUrl = 'test-audio.mp3';
  beforeEach(() => {
    //Arrange
    jest.clearAllMocks();
  });

  test('Should display media links when a fileURL is provided', async () => {
    // Act
    render(<MediaLink fileURL={fileUrl} />);

    await waitFor(() => {
      expect(screen.getByTestId('play_icon')).toBeInTheDocument();
    });

    //Assert
    expect(screen.getByTestId('play_icon')).toBeInTheDocument();
    expect(screen.getByTestId('download_icon')).toBeInTheDocument();
  });

  test('Should call `onPlayClick` and set modal content when play icon is clicked', () => {
    // Arrange

    render(<MediaLink fileURL={fileUrl} />);

    // Act
    fireEvent.click(screen.getByTestId('play_icon'));

    // Assert
    expect(setModalContent).toHaveBeenCalled();
  });

  test('Should verify that download icon is enabled', () => {
    // Arrange
    render(<MediaLink fileURL={fileUrl} />);

    // Act
    const downloadLink = screen.getByTestId('download_icon');
    fireEvent.click(downloadLink);

    // Assert
    expect(downloadLink).toHaveAttribute('href', 'test-audio.mp3');
    expect(downloadLink).toHaveAttribute('target', '_blank');
  });

  test('Should prevent download when enableDownload is false', () => {
    //Arrange
    render(<MediaLink fileURL={fileUrl} />);

    //Act
    const downloadLink = screen.getByTestId('download_icon');
    fireEvent.click(downloadLink);

    //Assert
    expect(downloadLink).toBeInTheDocument();
    expect(shouldEnableDownload).toHaveBeenCalledWith(fileUrl, true);
  });
});
