import { fireEvent, render } from '@testing-library/react';
import File from '../file';
import { TEST_FILE } from '../constants';

describe('File', () => {
  const testFileUpload = jest.fn();
  const testFileDelete = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should render File component', () => {
    // Act
    const { getByTestId } = render(
      <File
        config={{ info: TEST_FILE }}
        onFileUpload={testFileUpload}
        onFileDelete={testFileDelete}
        previewData={{}}
      />
    );

    // Assert
    expect(getByTestId('file-wrapper')).toBeInTheDocument();
  });

  it('Should trigger callback function when component is mounted', () => {
    // Act
    render(
      <File
        config={{ info: TEST_FILE }}
        onFileUpload={testFileUpload}
        onFileDelete={testFileDelete}
        previewData={{}}
      />
    );

    // Assert
    expect(testFileUpload).toHaveBeenCalledWith(TEST_FILE);
  });
});
