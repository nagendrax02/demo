import { CampaignAttachments } from '../../subject.type';
import Attachment from './Attachment';
import styles from './email-attachment.module.css';

export interface IEmailAttachment {
  attachments: CampaignAttachments;
}

const EmailAttachment = ({ attachments }: IEmailAttachment): JSX.Element | null => {
  if (!attachments?.length) {
    return null;
  }

  return (
    <div className={styles.attachment_container}>
      {attachments?.map((attachment) => {
        return (
          <Attachment
            key={attachment?.AttachmentAutoId}
            name={attachment?.Name}
            attachmentFile={attachment?.AttachmentFile}
          />
        );
      })}
    </div>
  );
};

export default EmailAttachment;
