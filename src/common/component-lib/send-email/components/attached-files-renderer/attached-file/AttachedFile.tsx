import { useState } from 'react';
import FileIcons from 'common/component-lib/file-icons';
import { IFile } from 'common/component-lib/file-library/file-library.types';
import AttachmentActions from './attachment-actions';
import styles from './attached-file.module.css';
import FilePreview from 'common/component-lib/file-preview';

export interface IAttachedFile {
  attachment: IFile;
  onRename: (selectedAttachment: IFile, newName: string) => void;
  onRemove: (selectedAttachment: IFile) => void;
}

const AttachedFile = (props: IAttachedFile): JSX.Element => {
  const { attachment, onRename, onRemove } = props;
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handlePreview = (): void => {
    setShowPreview(true);
  };

  return (
    <>
      {showPreview ? (
        <FilePreview
          showModal
          setShowModal={setShowPreview}
          previewData={[{ name: attachment?.Name, previewUrl: attachment?.Path }]}
          containerCustomStyleClass={styles.preview_modal}
        />
      ) : null}
      <div className={styles.wrapper}>
        <div className={styles.file_type_icon}>
          <FileIcons extension={attachment?.Extension} />
        </div>
        <div className={styles.preview_label} onClick={handlePreview}>
          {attachment?.Name}
        </div>
        <AttachmentActions attachment={attachment} onRemove={onRemove} onRename={onRename} />
      </div>
    </>
  );
};

export default AttachedFile;
