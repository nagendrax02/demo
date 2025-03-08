import { trackError } from 'common/utils/experience/utils/track-error';
import { MASKED_TEXT, NOT_UPLOADED, PREVIEW_NOT_AVAILABLE, VIEW_FILES } from 'common/constants';
import styles from './file.module.css';
import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { useState } from 'react';
import { IAugmentedCFSFile, getFileData } from './utils';
import FilePreview from 'common/component-lib/file-preview';
import { getEntityId } from 'common/utils/helpers';
import { CallerSource } from 'src/common/utils/rest-client';
export interface IFile {
  property: IEntityProperty;
  leadId: string;
  entityId: string | undefined;
  callerSource: CallerSource;
  isActivity?: boolean;
  removeDownloadOption?: boolean;
  preventDuplicateFiles?: boolean;
}

const File = ({
  property,
  entityId,
  isActivity,
  callerSource,
  leadId,
  removeDownloadOption,
  preventDuplicateFiles
}: IFile): JSX.Element => {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<IAugmentedCFSFile[]>([]);
  const { additionalData } = property;

  if (!property?.value || property?.value === NOT_UPLOADED) {
    return <div className={styles.files}>{NOT_UPLOADED}</div>;
  }

  if (property?.value === PREVIEW_NOT_AVAILABLE.value || property?.value === 'null') {
    return <div className={styles.files}>{PREVIEW_NOT_AVAILABLE.label}</div>;
  }

  if (property?.value === MASKED_TEXT) {
    return <div className={styles.files}>{MASKED_TEXT}</div>;
  }

  const handleFileClick = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setShowPreview(true);
      if (property?.isCFSField && !files?.length) {
        const cfsFiles = await getFileData({
          leadId: (leadId || getEntityId()) ?? additionalData?.leadId,
          entityId,
          property,
          isActivity,
          callerSource,
          preventDuplicateFiles
        });
        setFiles(cfsFiles);
      }
    } catch (error) {
      trackError(error);
      setFiles([]);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div data-testid="file" className={styles.files}>
        <div
          className={styles.view_files}
          onClick={(e) => {
            e.stopPropagation();
            handleFileClick();
          }}>
          {VIEW_FILES}
        </div>
      </div>
      {showPreview ? (
        <FilePreview
          isLoading={isLoading}
          showModal={showPreview}
          setShowModal={setShowPreview}
          previewData={files}
          removeDownloadOption={removeDownloadOption}
        />
      ) : null}
    </>
  );
};

File.defaultProps = {
  isActivity: false,
  removeDownloadOption: false,
  preventDuplicateFiles: false
};

export default File;
