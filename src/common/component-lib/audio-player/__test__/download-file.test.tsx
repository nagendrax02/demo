import { render, screen } from '@testing-library/react';
import DownloadFile from '../components/DownloadFile';

describe('DownloadFile component', () => {
  const fileURL = 'https://example.com/audio.mp3';

  it('Should render a download link with the correct href when enableDownload is true', () => {
    // Act
    render(<DownloadFile enableDownload={true} fileURL={fileURL} isLink={true} />);

    // Assert
    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', fileURL);
    expect(linkElement).not.toHaveClass('disabled');
  });

  it('Should render the text "Download" when isLink is true', () => {
    // Act
    render(<DownloadFile enableDownload={true} fileURL={fileURL} isLink={true} />);

    // Assert
    const textElement = screen.getByText('Download');
    expect(textElement).toBeInTheDocument();
  });

  it('Should render the download file icon component when isLink is false', () => {
    // Act
    render(<DownloadFile enableDownload={true} fileURL={fileURL} isLink={false} />);

    // Assert
    const iconElement = screen.getByTestId('material-icon-container');
    expect(iconElement).toBeInTheDocument();
  });
});
