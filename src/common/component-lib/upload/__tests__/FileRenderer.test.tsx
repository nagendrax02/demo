import { render } from '@testing-library/react';
import FileRenderer from '../file-renderer';
import { TEST_FILE } from '../constants';

describe('FileRenderer', () => {
  const testFile2 = new File(['test'], 'test2.png', { type: 'image/png' });
  const mockOnFileUpload = jest.fn();
  const mockOnFileDelete = jest.fn();

  it('Should render component', () => {
    // Act
    const { getByTestId } = render(
      <FileRenderer
        files={{}}
        onFileUpload={mockOnFileUpload}
        onFileDelete={mockOnFileDelete}
        previewData={{}}
      />
    );

    // Assert
    expect(getByTestId('upload-file-renderer')).toBeInTheDocument();
  });

  it('Should renders given files', () => {
    // Act
    const { getByText } = render(
      <FileRenderer
        files={{ 'test.png': { info: TEST_FILE }, 'test2.png': { info: testFile2 } }}
        onFileUpload={mockOnFileUpload}
        onFileDelete={mockOnFileDelete}
        previewData={{}}
      />
    );

    // Assert
    expect(getByText('test.png')).toBeInTheDocument();
    expect(getByText('test2.png')).toBeInTheDocument();
  });
});
