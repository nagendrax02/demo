import { render, fireEvent } from '@testing-library/react';
import Upload from '../Upload';

const testHandleUpload = jest.fn(async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 0));
});

const testHandleDelete = jest.fn(async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 0));
});

const testFile = new File(['test'], 'test.png', { type: 'image/png' });

describe('Upload', () => {
  it('Should render without crashing', () => {
    // Act
    const { getByTestId } = render(
      <Upload
        onFileUpload={testHandleUpload}
        selectedFiles={[]}
        updateFileList={() => {}}
        onFileDelete={testHandleDelete}
        previewData={{}}
      />
    );

    // Assert
    expect(getByTestId('upload-wrapper')).toBeInTheDocument();
  });

  it('Should call file change event', () => {
    // Arrange
    const { getByTestId } = render(
      <Upload
        onFileUpload={testHandleUpload}
        selectedFiles={[]}
        updateFileList={() => {}}
        onFileDelete={testHandleDelete}
        previewData={{}}
      />
    );
    const fileInput = getByTestId('upload-file-input');

    // Act
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Assert
    expect(testHandleUpload).toHaveBeenCalled();
  });
});
