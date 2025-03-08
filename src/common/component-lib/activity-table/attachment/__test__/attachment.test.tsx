import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ActivityAttachment from '../Attachment';
import { getAttachmentFiles } from '../utils';
import * as restClient from 'common/utils/rest-client';

jest.mock('../utils', () => ({
  getAttachmentFiles: jest.fn()
}));

jest.mock('common/utils/rest-client', () => ({
  httpGet: jest.fn(),
  Module: {
    Marvin: 'MARVIN'
  },
  CallerSource: {}
}));

const attachmentInfo = {
  Name: 'Name',
  AttachmentFile: 'AttachmentFile',
  AttachmentId: 'AttachmentId'
};

describe('ActivityAttachment', () => {
  it('Should render "View Attachments" link when there are attachments', async () => {
    // Arrange
    const mockData = [
      { id: 1, name: 'file1' },
      { id: 2, name: 'file2' }
    ];
    (getAttachmentFiles as jest.Mock).mockResolvedValue(mockData);

    jest.spyOn(restClient, 'httpGet').mockResolvedValueOnce([attachmentInfo]);

    // Act
    await act(async () => {
      render(
        <ActivityAttachment
          activityId="id"
          callerSource={restClient.CallerSource.ActivityHistory}
        />
      );
    });

    // Assert
    expect(screen.getByText('View Attachments')).toBeInTheDocument();
  });
});
