import { BasicEditor } from 'common/component-lib/editor';
import { IPreviewData } from 'common/component-lib/file-preview';
import Upload from 'common/component-lib/upload';
import styles from './addnotes.module.css';
import { IFileStorageConfig, INotesItem } from '../../notes.types';
import { ISelectedFile } from 'common/component-lib/upload/upload.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { getNotesAttachmentName } from '../../utils';

interface IBody {
  editorInput: string;
  onValueChange: (value: string) => void;
  handleFileUpload: (file: File) => Promise<void>;
  handleFileDelete: (file: File) => Promise<void>;
  previewData: Record<string, IPreviewData>;
  isLoading: boolean;
  fileStorageConfig: IFileStorageConfig | undefined;
  noteItem?: INotesItem;
  error?: string;
  onFilePreviewClick?: () => Promise<void>;
}

const Body = (props: IBody): JSX.Element => {
  const {
    editorInput,
    onValueChange,
    error,
    handleFileUpload,
    handleFileDelete,
    previewData,
    isLoading,
    fileStorageConfig,
    noteItem,
    onFilePreviewClick
  } = props;

  const getSelectedFiles = (): ISelectedFile[] | undefined => {
    return noteItem?.AttachmentName
      ? [{ name: getNotesAttachmentName(noteItem?.AttachmentName) || '' }]
      : [];
  };

  return (
    <>
      <BasicEditor
        value={editorInput}
        onValueChange={onValueChange}
        placeholderText="Enter Note"
        maxCharLimit={8000}
        suspenseFallback={<Shimmer height="190px" />}
      />
      <div className={styles.addnotes_error} data-testid="add-notes-error">
        {error}
      </div>
      <Upload
        selectedFiles={getSelectedFiles()}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
        updateFileList={(): void => {}}
        previewData={previewData}
        label="Add Attachment"
        customStyleClass={
          isLoading
            ? `${styles.addnotes_upload} ${styles.addnotes_upload_disable}`
            : styles.addnotes_upload
        }
        restrictedFormats={fileStorageConfig?.blockedExtensions}
        maxSizeInMB={+(fileStorageConfig?.allowedMaxSize || '')}
        onFilePreviewClick={onFilePreviewClick}
        allowedExtensions={fileStorageConfig?.allowedExtensions}
        suspenseFallback={<Shimmer height="32px" />}
      />
    </>
  );
};

Body.defaultProps = {
  error: '',
  noteItem: undefined,
  onFilePreviewClick: undefined
};

export default Body;
