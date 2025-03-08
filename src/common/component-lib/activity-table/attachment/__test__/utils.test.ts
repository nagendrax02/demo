import { waitFor } from '@testing-library/react';
import * as restClient from 'common/utils/rest-client';
import { getAttachmentFiles } from '../utils';

jest.mock('common/utils/rest-client', () => ({
  httpPost: jest.fn(),
  Module: {
    Marvin: 'MARVIN'
  },
  CallerSource: {}
}));

describe('getAttachmentFiles function', () => {
  it('Should return null when attachmentInfo is undefined', async () => {
    // Arrange
    const attachmentInfo = [];

    // Act
    const result = await getAttachmentFiles(attachmentInfo, restClient.CallerSource.NA);

    // Assert
    await waitFor(() => expect(result).toBeNull());
  });

  it('Should process attachmentInfo correctly', async () => {
    // Arrange
    const attachmentInfo = [
      {
        Name: 'Test',
        UsePreSignedURL: true,
        AttachmentId: '1',
        AttachmentFile: 'TestFile',
        ShowPlayIcon: true,
        RestrictDownload: true,
        Description: 'TestDescription'
      }
    ];
    jest.spyOn(restClient, 'httpPost').mockResolvedValue('testUrl');

    // Act
    const result = await getAttachmentFiles(attachmentInfo, restClient.CallerSource.NA);

    // Assert
    await waitFor(() => {
      expect(result).toHaveLength(1);
      expect(result![0]).toEqual({
        name: 'Test',
        previewUrl: 'testUrl',
        key: '1',
        type: 'audio',
        restrictDownload: true,
        description: 'TestDescription'
      });
    });
  });

  it('Should handle case when UsePreSignedURL is false', async () => {
    // Arrange
    const attachmentInfo = [
      {
        Name: 'Test',
        UsePreSignedURL: false,
        AttachmentId: '1',
        AttachmentFile: 'TestFile',
        ShowPlayIcon: false,
        RestrictDownload: true,
        Description: 'TestDescription'
      }
    ];

    // Act
    const result = await getAttachmentFiles(attachmentInfo, restClient.CallerSource.NA);

    // Assert
    await waitFor(() => {
      expect(result).toHaveLength(1);
      expect(result![0]).toEqual({
        name: 'Test',
        previewUrl: 'TestFile',
        key: '1',
        type: '',
        restrictDownload: true,
        description: 'TestDescription'
      });
    });
  });
});
