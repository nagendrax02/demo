import { trackError } from 'common/utils/experience/utils/track-error';
import { useState } from 'react';
import {
  IDocument,
  IDocumentsExpandable,
  IChildProspectDetailsDocumentsList
} from 'apps/documents/documents.types';
import styles from './expandable.module.css';
import { customSelection } from '@lsq/nextgen-preact/grid';
import docStyles from '../../../documents.module.css';
import Checkbox from '@lsq/nextgen-preact/checkbox';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import FilePreview, { IPreviewData } from 'common/component-lib/file-preview';
import Spinner from '@lsq/nextgen-preact/spinner';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { gridKey } from 'apps/documents/constants';

const DocumentsExpandable = ({
  record,
  entityIds,
  selectedItems
}: IDocumentsExpandable): JSX.Element => {
  const { showAlert } = useNotification();
  const [previewData, setPreviewData] = useState<IPreviewData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const { ChildProspectDetailsDocumentsList = [] } = record;

  const getItemIndex = (item: IChildProspectDetailsDocumentsList): number => {
    if (selectedItems?.[record.id]?.ChildProspectDetailsDocumentsList?.length) {
      return selectedItems[record.id].ChildProspectDetailsDocumentsList.findIndex(
        (val) => val.Id === item.Id
      );
    }
    return -1;
  };

  const handleSelect = (item: IChildProspectDetailsDocumentsList): void => {
    const selectedRows = [...(selectedItems?.[record.id]?.ChildProspectDetailsDocumentsList || [])];
    const index = getItemIndex(item);
    if (index > -1) {
      selectedRows.splice(index, 1);
    } else {
      selectedRows.push(item);
    }
    const selectedRecord = {
      ...record,
      ChildProspectDetailsDocumentsList: [...selectedRows]
    };
    if (selectedRows.length) {
      customSelection<IDocument>(record.id, gridKey, selectedRecord);
    } else {
      customSelection<IDocument>(record.id, gridKey);
    }
  };

  const handlePreview = async (item: IChildProspectDetailsDocumentsList): Promise<void> => {
    import('apps/documents/utils').then(async ({ getCFSPreviewConfig }) => {
      setShowModal(true);
      setLoading(true);
      const filesData = await getCFSPreviewConfig([item], entityIds?.lead, entityIds?.opportunity);
      const data = filesData?.Files?.map((file, index) => ({
        name: `${item.AttachmentName} - ${index + 1}`,
        previewUrl: file.FileUrl
      })) as IPreviewData[];
      setPreviewData(data);
      setLoading(false);
    });
  };

  const handleDownload = async (item: IChildProspectDetailsDocumentsList): Promise<void> => {
    try {
      import('apps/documents/utils').then(async ({ getCFSPreviewConfig }) => {
        setDownloading(true);
        const filesData = await getCFSPreviewConfig(
          [item],
          entityIds?.lead,
          entityIds?.opportunity
        );
        if (filesData) {
          import('common/utils/files').then(async ({ downloadFiles }) => {
            await downloadFiles(filesData, showAlert);
          });
        }
        setDownloading(false);
      });
    } catch (err) {
      trackError(err);
    }
  };

  return (
    <div className={styles.content}>
      {ChildProspectDetailsDocumentsList.map((item) => (
        <div className={styles.row_container} key={item.Id}>
          <Checkbox
            dataTestId={`checkbox-${item.id}`}
            checked={getItemIndex(item) > -1}
            changeSelection={(): void => {
              handleSelect(item);
            }}
          />
          <div className={styles.name}>
            <span
              data-testid={`preview-${item.Id}-${item.ParentId}`}
              onClick={(): void => {
                handlePreview(item);
              }}
              className={docStyles.previewable}>
              {item.AttachmentName}
            </span>
          </div>
          <div className={styles.show_btn}>
            <span
              onClick={(): void => {
                handleDownload(item);
              }}
              data-testid={`download-${item.Id}-${item.ParentId}`}>
              {downloading ? (
                <Spinner customStyleClass={docStyles.spinner} />
              ) : (
                <Icon
                  variant={IconVariant.Filled}
                  name="download"
                  customStyleClass={docStyles.action_icons}
                />
              )}
            </span>
          </div>
        </div>
      ))}
      {showModal ? (
        <FilePreview
          showModal={showModal}
          setShowModal={setShowModal}
          previewData={previewData}
          isLoading={loading}
        />
      ) : null}
    </div>
  );
};

export default DocumentsExpandable;
