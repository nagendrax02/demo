import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DownloadFiles from './DownloadFiles';
import * as restClient from 'common/utils/rest-client';
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';

const data = {
  cfs: [
    {
      id: 'mx_CustomObject_16',
      name: 'GLLO D3',
      schemaName: 'mx_CustomObject_16',
      value: '2023-12-14 00:00:00',
      fieldRenderType: 'Date',
      dataType: 'Date',
      colSpan: 1,
      isMatched: false
    },
    {
      id: 'mx_CustomObject_20',
      name: 'GLLO file1 - img',
      schemaName: 'mx_CustomObject_20',
      value: '0395c8bd.jpg,ef03078a.jpg,d71789f4.png,e111ab50.jpg',
      fieldRenderType: 'File',
      dataType: 'File',
      colSpan: 2,
      isMatched: false
    }
  ],
  entityId: '1243',
  parentSchemaName: 'mx_Glanza_CFS_LO'
};

const mockData = {
  Files: [
    {
      FileUrl:
        'https://lsq-private-storage-test.s3.ap-south-1.amazonaws.com/permanent/t/nouvetta/module/customobject/0395c8bd.jpg?X-Amz-Expires=1800&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5GG3TUXS74TSUW62/20231220/ap-south-1/s3/aws4_request&X-Amz-Date=20231220T132710Z&X-Amz-SignedHeaders=host&X-Amz-Signature=225c994f1b3ae0f130c6f78b9036306b81409c6d218dc33981e26ecabc307a24',
      FileName:
        'Glanza CFS LO - GLLO file1 - imgb3342419-4442-455a-9463-7671414c7e35/JohnSmith(1273)-Glanza CFS LO - GLLO file1 - img_GLLO file1 - img_1'
    }
  ],
  ZipFolderName: 'JohnSmith(1273)'
};

describe('Download Files', () => {
  test('Should render download files', () => {
    //Arrange
    render(
      <DownloadFiles
        data={data?.cfs as IAugmentedAttributeFields[]}
        entityId={data?.entityId}
        parentSchemaName={data?.parentSchemaName}
        leadId="234"
      />
    );

    //Assert
    expect(screen.getByText('Download Files')).toBeInTheDocument();
  });

  test('Should download files', async () => {
    //Arrange
    const mock = jest.spyOn(restClient, 'httpGet').mockResolvedValue(mockData);
    jest.mock('file-saver', () => ({ saveAs: jest.fn() }));
    render(
      <DownloadFiles
        data={data?.cfs as IAugmentedAttributeFields[]}
        entityId={data?.entityId}
        parentSchemaName={data?.parentSchemaName}
        leadId="234"
      />
    );

    const downloadEl = screen.getByTestId('download-files');

    fireEvent.click(downloadEl);

    //Assert
    await waitFor(() => {
      expect(downloadEl).toHaveClass('download_files');
    });
    mock.mockRestore();
  });
});
