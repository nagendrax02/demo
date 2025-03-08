import { trackError } from 'common/utils/experience/utils/track-error';
import Icon from '@lsq/nextgen-preact/icon';
import { INotesItem } from '../../notes.types';
import { getNotesAttachmentName } from '../../utils';
import styles from './notes-timeline.module.css';
import { lazy, useRef, useState } from 'react';
import FilePreview, { IPreviewData } from 'common/component-lib/file-preview';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { fetchNotesPresignedURL } from 'common/utils/helpers/notes-presigned-urls';

interface IAttachment {
  notesItem: INotesItem;
  entityId: string;
}

const NoteAttachment = (props: IAttachment): JSX.Element => {
  const { notesItem, entityId } = props;
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileName = getNotesAttachmentName(notesItem?.AttachmentName);
  const previewData = useRef<IPreviewData>({
    name: fileName,
    previewUrl: ''
  });

  const onClick = async (): Promise<void> => {
    try {
      setShowPreview(true);
      setIsLoading(true);
      if (!previewData?.current?.previewUrl) {
        const presignedUrl = await fetchNotesPresignedURL(fileName, entityId);
        previewData.current = {
          name: fileName,
          previewUrl: presignedUrl
        };
      }
    } catch (error) {
      trackError(error);
    }
    setIsLoading(false);
  };

  return notesItem?.AttachmentName ? (
    <>
      <div className={styles.notes_attachment_wrapper}>
        <Icon name={'attach_file'} customStyleClass={styles.notes_attachfile_icon} />
        <a data-testid="note-file-attachment" onClick={onClick}>
          {getNotesAttachmentName(notesItem?.AttachmentName)}
        </a>
      </div>
      {showPreview ? (
        <FilePreview
          showModal={showPreview}
          setShowModal={setShowPreview}
          previewData={[previewData.current]}
          isLoading={isLoading}
        />
      ) : null}
    </>
  ) : (
    <></>
  );
};

export default NoteAttachment;

export const Attachment = withSuspense(lazy(() => import('./Attachment')));
