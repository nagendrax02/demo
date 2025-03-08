import { render, screen, waitFor } from '@testing-library/react';
import ErrorRenderer from '../error-renderer';
import { FileError } from '../upload.types';
import useUploadStore from '../upload.store';

jest.mock('../upload.store');

describe('ErrorRenderer', () => {
  it('Should render error messages', async () => {
    // Arrange
    (useUploadStore as unknown as jest.Mock).mockReturnValue({
      fileError: {
        [FileError.FileSizeExceeded]: ['file1', 'file2'],
        [FileError.FileCountExceeded]: [],
        [FileError.FileFormatInvalid]: ['file3'],
        [FileError.FileSizeZero]: ['file4']
      }
    });

    // Act
    render(<ErrorRenderer />);

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText('file1,file2 exceeds the file size limit of 10MB')
      ).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText('Maximum number of files reached')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        screen.getByText('Error uploading file: file3. Format of uploaded file is not supported!')
      ).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText('file4 size is less than or equal to zero byte.')).toBeInTheDocument()
    );
  });
});
