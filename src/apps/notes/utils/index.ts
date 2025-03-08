import {
  deleteNotes,
  fetchNotes,
  removeAttachmentOfNote,
  saveNotes,
  showNotesAlert,
  updateNotes
} from './notes';
import useNotes from './useNotes';
import {
  deleteFile,
  generatePreviewData,
  getNotesFileStorageConfig,
  getNotesAttachmentName,
  handleFileDelete,
  handleFileUpload,
  uploadFile,
  populateEditCaseData
} from './utils';

export {
  uploadFile,
  generatePreviewData,
  saveNotes,
  deleteFile,
  fetchNotes,
  getNotesAttachmentName,
  deleteNotes,
  updateNotes,
  handleFileUpload,
  handleFileDelete,
  getNotesFileStorageConfig,
  populateEditCaseData,
  removeAttachmentOfNote,
  showNotesAlert
};

export default useNotes;
