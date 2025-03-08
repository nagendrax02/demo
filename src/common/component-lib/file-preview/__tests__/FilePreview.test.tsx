import { render, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import FilePreview from '../FilePreview';
import { saveAs } from 'file-saver';

jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

window.fetch = jest.fn();
const fetchResponse = {
  ok: true,
  blob: async () =>
    new Promise((res) => {
      var blob = new Blob([''], { type: 'text/mp4' });
      blob['name'] = 'file3';
      res(blob);
    })
};

describe('FilePreview', () => {
  const mockPreviewData = [
    { name: 'file1.png', previewUrl: 'url1' },
    { name: 'file2.png', previewUrl: 'url2' },
    { name: 'file3.mp4', previewUrl: 'url3' }
  ];

  it('Should render modal when state is true', async () => {
    // Act
    const { getByTestId } = render(
      <FilePreview showModal={true} setShowModal={jest.fn()} previewData={mockPreviewData} />
    );

    // Assert
    await waitFor(() => {
      expect(getByTestId('modal')).toBeInTheDocument();
    });
  });

  it('Should navigate to the next file when next button is clicked', async () => {
    // Arrange
    const { getByText } = render(
      <FilePreview showModal={true} setShowModal={jest.fn()} previewData={mockPreviewData} />
    );
    const nextButton = getByText('Next');

    // Act
    fireEvent.click(nextButton);

    // Assert
    await waitFor(() => {
      expect(getByText('file2.png')).toBeInTheDocument();
    });
  });

  it('Should navigate to the previous file when previous button is clicked', async () => {
    // Arrange
    const { getByText } = render(
      <FilePreview showModal={true} setShowModal={jest.fn()} previewData={mockPreviewData} />
    );
    const nextButton = getByText('Next');
    const prevButton = getByText('Previous');
    fireEvent.click(nextButton);

    // Act
    fireEvent.click(prevButton);

    // Assert
    await waitFor(() => {
      expect(getByText('file1.png')).toBeInTheDocument();
    });
  });

  it('Should trigger file download when download button is clicked', async () => {
    // Arrange
    const { getByTestId } = render(
      <FilePreview showModal={true} setShowModal={jest.fn()} previewData={mockPreviewData} />
    );
    const nextButton = getByTestId('file-download-btn');
    jest.spyOn(window, 'fetch').mockResolvedValue(fetchResponse as Response);
    // Act
    fireEvent.click(nextButton);

    // Assert
    await waitFor(() => {
      expect(saveAs).toHaveBeenCalled();
    });
  });
});
