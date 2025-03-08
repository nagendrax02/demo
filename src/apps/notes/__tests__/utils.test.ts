import {
  deleteFile,
  fetchNotes,
  getNotesAttachmentName,
  handleFileDelete,
  handleFileUpload,
  saveNotes,
  updateNotes
} from '../utils';
import * as restClient from '../../../common/utils/rest-client';
import { notes } from '../__mocks__/data';
import { fetchNextPage } from '../utils/notes';
import { DEFAULT_ENTITY_IDS } from '../../../common/constants';

const testFile = new File(['test'], 'test.png', { type: 'image/png' });
const entityIds = DEFAULT_ENTITY_IDS;

describe('Add Notes utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('Should upload file', async () => {
    // Arrange
    const postCall = jest
      .spyOn(restClient, 'httpPost')
      .mockResolvedValueOnce({
        RelatedProspectId: '72553bf8-0e36-49ea-a035-965cd4e4fbcc',
        Note: 'Note',
        Description: 'Note',
        AttachmentName: 'Copy%20(2)%20of%20barcode.gif',
        AttachmentURL: '',
        RelatedActivityId: ''
      })
      .mockResolvedValueOnce('link');

    // Act
    await handleFileUpload({
      file: testFile,
      setIsDisabled: jest.fn(),
      setPreviewData: jest.fn(),
      attachmentName: { current: '' },
      entityId: 'id'
    });

    // Assert
    expect(postCall).toHaveBeenCalledTimes(2);
  });

  it('Should delete file', async () => {
    // Arrange
    const postCall = jest.spyOn(restClient, 'httpPost').mockResolvedValue('');

    // Act
    await deleteFile('testFile', entityIds.lead);

    // Assert
    expect(postCall).toHaveBeenCalledTimes(1);
  });

  it('Should save notes', async () => {
    // Arrange
    const postCall = jest.spyOn(restClient, 'httpPost').mockResolvedValue('');

    // Act
    await saveNotes(entityIds, 'Editor Input', 'Attachment Name');

    // Assert
    expect(postCall).toHaveBeenCalledTimes(1);
  });

  it('Should update notes', async () => {
    // Arrange
    const postCall = jest.spyOn(restClient, 'httpPost').mockResolvedValue('');

    // Act
    await updateNotes({ entityIds, notes: notes[0], editorInput: 'Editor Input' });

    // Assert
    expect(postCall).toHaveBeenCalledTimes(1);
  });

  it('Should fetch Notes', async () => {
    // Arrange
    const postCall = jest.spyOn(restClient, 'httpPost').mockResolvedValue('');

    // Act
    await fetchNotes({
      page: 1,
      entityIds: DEFAULT_ENTITY_IDS,
      startDate: undefined,
      endDate: undefined
    });

    // Assert
    expect(postCall).toHaveBeenCalledTimes(1);
  });

  it('Should fetch next page', async () => {
    // Arrange
    const postCall = jest.spyOn(restClient, 'httpPost').mockResolvedValue({ List: notes });

    // Act
    await fetchNextPage({
      pageNumber: 2,
      setNotesList: jest.fn(),
      notesList: [],
      startDate: undefined,
      endDate: undefined,
      entityIds: DEFAULT_ENTITY_IDS
    });

    // Assert
    expect(postCall).toHaveBeenCalledTimes(1);
  });

  it('Should delete file', async () => {
    // Arrange
    const postCall = jest.spyOn(restClient, 'httpPost').mockResolvedValue('');
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    // Act
    await handleFileDelete({
      file,
      setIsDisabled: jest.fn(),
      setPreviewData: jest.fn(),
      previewData: {},
      entityId: 'id',
      showAlert: jest.fn()
    });

    // Assert
    expect(postCall).toHaveBeenCalledTimes(1);
  });

  it('Should get decoded string', () => {
    // Arrange
    const input = 'Hello%20World%21';
    const expectedOutput = 'Hello World!';

    // Act
    const result = getNotesAttachmentName(input);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
