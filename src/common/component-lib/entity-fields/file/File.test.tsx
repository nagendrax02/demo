import { render, screen } from '@testing-library/react';
import File from './File';
import { DataType, RenderType } from 'common/types/entity/lead';
import { CallerSource } from 'src/common/utils/rest-client';

describe('File', () => {
  test('Should render view files when file name exist', () => {
    //Arrange
    render(
      <File
        property={{
          id: '1',
          name: 'File',
          value: 'hello.png',
          fieldRenderType: RenderType.File,
          schemaName: 'mx_file',
          dataType: DataType.File
        }}
        entityId="234"
        leadId="234"
        callerSource={CallerSource.NA}
      />
    );

    //Assert
    expect(screen.getByText('View files')).toBeInTheDocument();
  });

  test('Should show Not Uploaded when file value not exist', () => {
    //Arrange
    render(
      <File
        property={{
          id: '1',
          name: 'File',
          value: '',
          fieldRenderType: RenderType.File,
          schemaName: 'mx_file',
          dataType: DataType.File
        }}
        entityId="234"
        leadId="234"
        callerSource={CallerSource.NA}
      />
    );

    //Assert
    expect(screen.getByText('Not Uploaded')).toBeInTheDocument();
  });

  test('Should show PREVIEW_NOT_AVAILABLE when file value is PREVIEW_NOT_AVAILABLE', () => {
    //Arrange
    render(
      <File
        property={{
          id: '1',
          name: 'File',
          value: 'PREVIEW_NOT_AVAILABLE',
          fieldRenderType: RenderType.File,
          schemaName: 'mx_file',
          dataType: DataType.File
        }}
        entityId="234"
        leadId="234"
        callerSource={CallerSource.NA}
      />
    );

    //Assert
    expect(screen.getByText('Preview not available')).toBeInTheDocument();
  });
});
