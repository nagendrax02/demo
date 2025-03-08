import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Module, httpGet } from 'common/utils/rest-client';
import Icon from '@lsq/nextgen-preact/icon';
import FilePreview from 'common/component-lib/file-preview';
import { IAttachment, IAttachmentInfo, IAttachmentFile } from './attachment.types';
import { getAttachmentFiles } from './utils';
import styles from './attachment.module.css';
import { API_ROUTES } from 'src/common/constants';

const Attachment = ({ activityId, callerSource, leadId }: IAttachment): JSX.Element | null => {
  const [attachmentFiles, setAttachmentFiles] = useState<IAttachmentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchAttachments = async (): Promise<void> => {
      try {
        if (!attachmentFiles?.length) {
          setIsLoading(true);
          const response = (await httpGet({
            path: `${API_ROUTES.activitySalesAttachment}?&relatedObjectId=${activityId}&prospectActivityId=${activityId}&doNotGeneratePreSignedUrl=true`,
            module: Module.Marvin,
            callerSource
          })) as IAttachmentInfo[];
          const attachFiles = await getAttachmentFiles(response, callerSource, leadId);
          if (response) setAttachmentFiles(attachFiles || []);
          setIsLoading(false);
        }
      } catch (error) {
        trackError('failed to load Attachment API', error);
        setAttachmentFiles([]);
        setIsLoading(false);
      }
    };

    if (show) fetchAttachments();
  }, [show]);

  const onClick = (): void => {
    setShow(true);
  };

  return (
    <>
      <div className={styles.attachment_wrapper}>
        <Icon name="attach_file" customStyleClass={styles.attachment_icon} />
        <span onClick={onClick} className={styles.attachment_link}>
          View Attachments
        </span>
      </div>
      {show ? (
        <FilePreview
          previewData={attachmentFiles || []}
          showModal={show}
          setShowModal={setShow}
          isLoading={isLoading}
        />
      ) : null}
    </>
  );
};

export default Attachment;
