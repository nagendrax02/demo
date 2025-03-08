import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VideoPlayer from '.';

describe('VideoPlayer', () => {
  it('Should render video player when download is enabled.', async () => {
    const { queryByTestId } = render(
      <VideoPlayer fileUrl="http://example.com/video.webm" enableDownload />
    );

    await waitFor(() => expect(queryByTestId('video-element')).toBeInTheDocument());
  });

  it('Should render video player when download is disabled.', async () => {
    const { queryByTestId } = render(
      <VideoPlayer fileUrl="http://example.com/video.webm" enableDownload={false} />
    );

    await waitFor(() => expect(queryByTestId('video-element')).toBeInTheDocument());
  });

  it('Should not render video player when error occurs in loading video', async () => {
    const { queryByTestId } = render(
      <VideoPlayer fileUrl="http://example.com/video.webm" enableDownload={false} />
    );

    fireEvent.error(screen.getByTestId('video-source'));

    await waitFor(() => expect(queryByTestId('video-element')).not.toBeInTheDocument());
  });
});
