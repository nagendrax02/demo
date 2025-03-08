import { trackError } from 'common/utils/experience/utils/track-error';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from './download-files.module.css';
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import { FileDataSource, IDocumentsToFetch } from 'common/utils/files/files.type';
import { DataType, RenderType } from 'common/types/entity/lead';
import { fetchCFSFiles, downloadFiles } from 'common/utils/files';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { useState } from 'react';
import Spinner from '@lsq/nextgen-preact/spinner';
import { CallerSource } from 'src/common/utils/rest-client';

export interface IDownloadFiles {
  leadId: string;
  entityId: string;
  parentSchemaName: string;
  data: IAugmentedAttributeFields[];
  customStyleClass?: string;
  hideIcon?: boolean;
  isActivity?: boolean;
  getAllCFSDataOfActivity?: boolean;
}

const getFileFields = (data: IAugmentedAttributeFields[]): IAugmentedAttributeFields[] => {
  if (!data) {
    return [];
  }
  return data?.filter(
    (item) =>
      (item.dataType === DataType.File || item.fieldRenderType === RenderType.File) && item?.value
  );
};

const getDocumentsToFetch = (
  data: IAugmentedAttributeFields[],
  entityId: string,
  parentSchemaName: string
): IDocumentsToFetch[] => {
  const documentsToFetch: IDocumentsToFetch[] = [];
  data.forEach((cfsFileField) => {
    documentsToFetch.push({
      EntityId: entityId,
      DataSource: FileDataSource.CFS,
      FieldSchema: parentSchemaName,
      CFSSchema: cfsFileField.schemaName
    });
  });
  return documentsToFetch;
};

const DownloadFiles = ({
  data,
  entityId,
  parentSchemaName,
  leadId,
  customStyleClass,
  hideIcon,
  isActivity,
  getAllCFSDataOfActivity
}: IDownloadFiles): JSX.Element => {
  const { showAlert } = useNotification();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (): Promise<void> => {
    try {
      if (isDownloading) {
        return;
      }

      const documentsToFetch: IDocumentsToFetch[] = getDocumentsToFetch(
        getFileFields(data),
        entityId || leadId,
        parentSchemaName
      );
      setIsDownloading(true);
      const fileInfo = await fetchCFSFiles(
        {
          leadId: leadId || entityId,
          entityId: isActivity ? entityId : '',
          documentsToFetch: documentsToFetch,
          getAllCFSDataOfActivity: getAllCFSDataOfActivity
        },
        CallerSource.EntityAttributeDetails
      );

      if (fileInfo) {
        await downloadFiles(fileInfo, showAlert);
      }

      setIsDownloading(false);
    } catch (error) {
      trackError(error);
      alert({
        message: 'There was an error processing the request. Please contact administrator',
        type: Type.ERROR
      });
    }
  };

  return (
    <>
      <div
        className={`${styles.download_files} ${
          isDownloading ? styles.disable_download : ''
        } ${customStyleClass}`}
        onClick={handleDownload}
        data-testid="download-files">
        {!hideIcon ? (
          <Icon
            name="download_2"
            variant={IconVariant.Filled}
            customStyleClass={styles.download_icon}
          />
        ) : null}
        <div className={styles.download_text}>Download Files</div>
        {isDownloading ? <Spinner customStyleClass={styles.spinner} /> : null}
      </div>
    </>
  );
};

DownloadFiles.defaultProps = {
  hideIcon: false,
  customStyleClass: '',
  isActivity: false
};

export default DownloadFiles;
