import { trackError } from 'common/utils/experience/utils/track-error';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from './email-attachment.module.css';
import { Suspense, useState } from 'react';
import { IAugmentedCFSFile } from 'common/component-lib/entity-fields/file/utils';
import FilePreview from 'common/component-lib/file-preview';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import FileIcons from 'common/component-lib/file-icons';
import { API_ROUTES } from 'common/constants';

interface IAttachment {
  name: string;
  attachmentFile: string;
}

const Attachment = ({ name, attachmentFile }: IAttachment): JSX.Element => {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<IAugmentedCFSFile[]>([]);

  const extension = name?.split('.')?.pop() || 'common';

  const handleAttachmentClick = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setShowPreview(true);
      if (!files?.length) {
        const previewUrl: string = await httpGet({
          path: `${API_ROUTES.emailAttachmentGetFileName}${attachmentFile}`,
          module: Module.Marvin,
          callerSource: CallerSource.ActivityHistory
        });
        setFiles([{ name: name, previewUrl: previewUrl }]);
      }
    } catch (error) {
      trackError(error);
      setFiles([]);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className={styles.attachment} onClick={handleAttachmentClick} title={name}>
        <div className={styles.file}>
          <Suspense fallback={<></>}>
            <FileIcons extension={extension} />
          </Suspense>
          <div className={styles.name}>{name}</div>
        </div>
        <Icon
          name="visibility"
          customStyleClass={styles.visibility_icon}
          variant={IconVariant.Filled}
        />
      </div>
      {showPreview ? (
        <FilePreview
          isLoading={isLoading}
          showModal={showPreview}
          setShowModal={setShowPreview}
          previewData={files}
          title={name}
        />
      ) : null}
    </>
  );
};

export default Attachment;
