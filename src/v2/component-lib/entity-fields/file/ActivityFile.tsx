import { trackError } from 'common/utils/experience/utils/track-error';
import { NOT_UPLOADED, PREVIEW_NOT_AVAILABLE, VIEW_FILES } from 'common/constants';
import { IActivityFields } from 'common/component-lib/modal/activity-details-modal/activity-details.types';
import styles from './file.module.css';
import { useState } from 'react';
import { IAugmentedCFSFile, getCfsFiles } from './utils';
import FilePreview from 'common/component-lib/file-preview';
import { CallerSource } from 'src/common/utils/rest-client';
export interface IActivityFile {
  property: IActivityFields;
  cfsSchemaName?: string;
  activityId: string;
  leadId: string | undefined;
  entityId: string | undefined;
  callerSource: CallerSource;
  preventDuplicateFiles?: boolean;
}

const ActivityFile = ({
  property,
  leadId,
  entityId,
  activityId,
  cfsSchemaName,
  callerSource,
  preventDuplicateFiles
}: IActivityFile): JSX.Element => {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<IAugmentedCFSFile[]>([]);

  if (!property?.Value) {
    return <div className={styles.files}>{NOT_UPLOADED}</div>;
  }

  if (property?.Value === PREVIEW_NOT_AVAILABLE.value) {
    return <div className={styles.files}>{PREVIEW_NOT_AVAILABLE.label}</div>;
  }

  const handleFileClick = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setShowPreview(true);
      const cfsFiles = await getCfsFiles({
        activityId,
        leadId,
        entityId: entityId ? entityId : undefined,
        property,
        cfsSchema: cfsSchemaName,
        callerSource,
        preventDuplicateFiles
      });
      setFiles(cfsFiles);
    } catch (error) {
      trackError(error);
      setFiles([]);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div data-testid="file" className={styles.files}>
        <div className={styles.view_files} onClick={handleFileClick}>
          {VIEW_FILES}
        </div>
      </div>
      {showPreview ? (
        <FilePreview
          isLoading={isLoading}
          showModal={showPreview}
          setShowModal={setShowPreview}
          previewData={files}
        />
      ) : null}
    </>
  );
};

ActivityFile.defaultProps = {
  cfsSchemaName: ''
};

export default ActivityFile;
