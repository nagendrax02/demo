import { trackError } from 'common/utils/experience/utils/track-error';
import { createPortal } from 'react-dom';
import Modal from '@lsq/nextgen-preact/modal';
import { IPreviewData } from 'common/component-lib/file-preview';
import styles from './addnotes.module.css';
import { useEffect, useRef, useState } from 'react';
import {
  getNotesFileStorageConfig,
  handleFileDelete,
  populateEditCaseData,
  removeAttachmentOfNote,
  saveNotes,
  showNotesAlert,
  updateNotes
} from '../../utils';
import Body from './Body';
import Footer from './Footer';
import { IFileStorageConfig, INotesItem } from '../../notes.types';
import { handleFileUpload } from '../../utils';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { alertConfig } from '../../constants';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';

interface IAddNotes {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  entityIds: IEntityIds;
  noteItem?: INotesItem;
  isEdit?: boolean;
  setNoteItem?: React.Dispatch<React.SetStateAction<INotesItem>>;
  syncStores?: (updatedNotes: INotesItem) => void;
  onSuccess?: () => void;
}

export const MAX_LENGTH_FOR_NOTES_TEXT_AREA = 8000;

const AddNotes = (props: IAddNotes): JSX.Element => {
  const {
    showModal,
    setShowModal,
    entityIds,
    noteItem,
    isEdit,
    setNoteItem,
    syncStores,
    onSuccess
  } = props;
  const [editorInput, setEditorInput] = useState(noteItem?.Note || noteItem?.Description || '');
  const [inputError, setInputError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, IPreviewData>>({});
  const attachmentName = useRef<string | undefined>(undefined);
  const { showAlert } = useNotification();
  const [fileStorageConfig, setFileStorageConfig] = useState<IFileStorageConfig>();

  useEffect(() => {
    getNotesFileStorageConfig(setFileStorageConfig, fileStorageConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilePreviewClick = async (): Promise<void> => {
    try {
      if (noteItem?.AttachmentName && !previewData[noteItem?.AttachmentName])
        await populateEditCaseData({
          noteItem,
          entityId: entityIds?.lead,
          setPreviewData
        });
    } catch (error) {
      trackError(error);
      showAlert(alertConfig.GENERIC);
    }
  };

  const onFileUpload = async (file: File): Promise<void> => {
    if (!noteItem?.AttachmentName && file) {
      await handleFileUpload({
        file,
        setIsDisabled,
        setPreviewData,
        attachmentName,
        entityId: entityIds?.lead
      });
    }
  };

  const onFileDelete = async (file: File): Promise<void> => {
    await handleFileDelete({
      file,
      setIsDisabled,
      setPreviewData,
      previewData,
      entityId: entityIds?.lead,
      showAlert
    });
    attachmentName.current = '';
    if (isEdit && noteItem) {
      await updateNotes({
        entityIds,
        notes: noteItem,
        editorInput,
        customBody: {
          deleteAttachmentOnly: true,
          fileName: noteItem?.AttachmentName,
          AttachmentName: attachmentName.current
        }
      });
      const updatedNoteItem = removeAttachmentOfNote(noteItem);
      setNoteItem?.(updatedNoteItem);
      syncStores?.(updatedNoteItem);
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (!editorInput) {
        setInputError('Required Field');
        return;
      }

      if (editorInput.length > MAX_LENGTH_FOR_NOTES_TEXT_AREA) {
        setInputError('Please ensure your notes do not exceed 8000 characters');
        return;
      }

      if (isEdit && noteItem) {
        // AttachmentName should be sent only when attachment got changed in edit case.
        await updateNotes({
          entityIds,
          notes: noteItem,
          editorInput,
          customBody: { AttachmentName: attachmentName.current }
        });
      } else {
        await saveNotes(entityIds, editorInput, attachmentName.current);
      }
      showNotesAlert(showAlert, true, isEdit);
      updateLeadAndLeadTabs(true);
      onSuccess?.();
      setShowModal(false);
    } catch (err) {
      trackError(err);
      showNotesAlert(showAlert, false, isEdit);
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <Modal show={showModal}>
      <Modal.Header
        title={isEdit ? 'Edit Notes' : 'Add Notes'}
        onClose={(): void => {
          setShowModal(false);
        }}
      />
      <Modal.Body customStyleClass={styles.addnotes_body}>
        <Body
          editorInput={editorInput}
          onValueChange={setEditorInput}
          error={inputError}
          handleFileUpload={onFileUpload}
          handleFileDelete={onFileDelete}
          previewData={previewData}
          isLoading={isLoading}
          fileStorageConfig={fileStorageConfig}
          noteItem={noteItem}
          onFilePreviewClick={onFilePreviewClick}
        />
      </Modal.Body>
      <Modal.Footer>
        <Footer
          setShowModal={setShowModal}
          onSave={handleSave}
          isDisabled={isDisabled || isLoading}
          isLoading={isLoading}
        />
      </Modal.Footer>
    </Modal>,
    document.body
  );
};

export default AddNotes;
