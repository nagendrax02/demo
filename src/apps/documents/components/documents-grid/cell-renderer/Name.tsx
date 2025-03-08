import { useState } from 'react';
import { IDocument } from '../../../documents.types';
import styles from '../../../documents.module.css';
import { getNotesAttachmentName } from 'common/utils/helpers/notes-presigned-urls';
import FilePreview, { IPreviewData } from 'common/component-lib/file-preview';
import { getPreviewData } from './utils';

const DocumentName = ({ record }: { record: IDocument }): JSX.Element => {
  const isPreviewable =
    !record?.ChildProspectDetailsDocumentsList ||
    !record?.ChildProspectDetailsDocumentsList?.length;

  const attachmentName =
    record.Type === 3 || record.DocumentType?.toLowerCase() === 'note'
      ? getNotesAttachmentName(record.AttachmentName)
      : record.AttachmentName;

  const [previewData, setPreviewData] = useState<IPreviewData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const getLeadId = (): string => {
    return record?.EntityIds?.lead || '';
  };

  const handleClick = async (): Promise<void> => {
    if (isPreviewable) {
      import('apps/documents/utils').then(async ({ getDocumentPreviewFileUrl, getFileData }) => {
        setShowModal(true);
        if (!previewData.length) {
          setLoading(true);
          setPreviewData(
            await getPreviewData({
              record,
              leadId: getLeadId(),
              getDocumentPreviewFileUrl,
              getFileData,
              attachmentName
            })
          );
          setLoading(false);
        }
      });
    }
  };

  return (
    <>
      <div
        data-testid={`name-${record.Id}`}
        className={isPreviewable ? styles.previewable : styles.not_previewable}
        onClick={handleClick}>
        {attachmentName}
      </div>
      {showModal ? (
        <FilePreview
          showModal={showModal}
          setShowModal={setShowModal}
          previewData={previewData}
          isLoading={loading}
          title={getNotesAttachmentName(record.AttachmentName)}
        />
      ) : null}
    </>
  );
};

export default DocumentName;
