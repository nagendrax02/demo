import { trackError } from 'common/utils/experience/utils/track-error';
import { IDocument } from '../../../documents.types';
import styles from '../../../documents.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { Suspense, useState, lazy } from 'react';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { deleteDocument } from 'apps/documents/documents.store';
import Spinner from '@lsq/nextgen-preact/spinner';
import { IFileInfo } from 'common/utils/files';
import { getFileDownloadData } from './utils';

const DocumentDeleteModal = lazy(() => import('../DocumentDeleteModal'));

const ModifiedBy = ({ record }: { record: IDocument }): JSX.Element => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showAlert } = useNotification();
  const [loading, setLoading] = useState(false);
  const isPreviewable =
    !record?.ChildProspectDetailsDocumentsList ||
    !record?.ChildProspectDetailsDocumentsList?.length;

  const handleDelete = async (): Promise<void> => {
    await deleteDocument(record);
    showAlert({ type: Type.SUCCESS, message: 'Document deleted successfully' });
    setShowDeleteModal(false);
  };

  const leadId = record?.EntityIds?.lead;
  const opportunityId = record?.EntityIds?.opportunity;

  const handleDownload = async (): Promise<void> => {
    import('apps/documents/utils').then(
      async ({ getFileData, getDocumentPreviewFileUrl, getFileName }) => {
        try {
          setLoading(true);
          const fileData: IFileInfo = await getFileDownloadData({
            record,
            getFileData,
            getDocumentPreviewFileUrl,
            getFileName,
            leadId,
            opportunityId
          });
          if (fileData) {
            import('common/utils/files').then(async ({ downloadFiles }) => {
              await downloadFiles(fileData, showAlert);
            });
          }
        } catch (err) {
          trackError(err);
        }
        setLoading(false);
      }
    );
  };

  return (
    <>
      <div className={styles.modified_by} data-testid={`modified-by-${record.Id}`}>
        <div>{record.ModifiedByName}</div>
        {isPreviewable ? (
          <div className="show_on_hover">
            <div className={styles.actions}>
              {!record?.RestrictDownload ? (
                <span onClick={handleDownload} data-testid={`download-${record.Id}`}>
                  {loading ? (
                    <Spinner customStyleClass={styles.spinner} />
                  ) : (
                    <Icon
                      variant={IconVariant.Filled}
                      name="download"
                      customStyleClass={styles.action_icons}
                    />
                  )}
                </span>
              ) : null}
              {!record?.RestrictDelete ? (
                <span
                  data-testid={`delete-${record.Id}`}
                  onClick={(): void => {
                    setShowDeleteModal(true);
                  }}>
                  <Icon
                    variant={IconVariant.Filled}
                    name="delete"
                    customStyleClass={styles.action_icons}
                  />
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      {showDeleteModal ? (
        <Suspense fallback={<></>}>
          <DocumentDeleteModal
            showModal={showDeleteModal}
            setShowModal={setShowDeleteModal}
            onDelete={handleDelete}
          />
        </Suspense>
      ) : null}
    </>
  );
};

export default ModifiedBy;
