import { IFile } from '../../../file-library/file-library.types';
import AttachedFile from './attached-file';
import styles from './attached-files-renderer.module.css';

export interface IAttachedFilesRenderer {
  attachments: IFile[];
  setAttachments: (newFiles: IFile[]) => void;
}

const AttachedFilesRenderer = (props: IAttachedFilesRenderer): JSX.Element => {
  const { attachments, setAttachments } = props;

  const handleFileRename = (selectedAttachment: IFile, newName: string): void => {
    const newAttachments = [...attachments];
    const attachmentIndex = newAttachments.findIndex(
      (file) => file.Path === selectedAttachment?.Path
    );
    if (attachmentIndex > -1) {
      newAttachments[attachmentIndex].Name = newName;
      setAttachments(newAttachments);
    }
  };

  const handleFileRemove = (selectedAttachment: IFile): void => {
    const newAttachments = [...attachments];
    const attachmentIndex = newAttachments.findIndex(
      (file) => file.Path === selectedAttachment?.Path
    );
    if (attachmentIndex > -1) {
      newAttachments.splice(attachmentIndex, 1);
      setAttachments(newAttachments);
    }
  };

  const getAttachments = (): JSX.Element[] => {
    return attachments?.map((attachment) => {
      return (
        <AttachedFile
          attachment={attachment}
          key={attachment.Id}
          onRename={handleFileRename}
          onRemove={handleFileRemove}
        />
      );
    });
  };

  return <div className={styles.container}>{getAttachments()}</div>;
};

export default AttachedFilesRenderer;
