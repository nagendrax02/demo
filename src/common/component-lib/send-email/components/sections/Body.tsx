import { AdvancedEditor } from 'common/component-lib/editor';
import SideModal from '@lsq/nextgen-preact/side-modal';
import { CONSTANTS } from '../../constants';
import EmailFields from '../fields';
import styles from './sections.module.css';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import useSendEmailStore from '../../send-email.store';
import AttachedFilesRenderer from '../attached-files-renderer';
import { IFile } from '../../../file-library/file-library.types';
import { CallerSource } from 'common/utils/rest-client';

const Body = ({ callerSource }: { callerSource: CallerSource }): JSX.Element => {
  const { fields, setFields, isLoading, emailConfig } = useSendEmailStore();

  const handleAttachmentUpdate = (newAttachments: IFile[]): void => {
    setFields({ attachments: newAttachments });
  };

  const getBody = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className={styles.shimmer_wrapper}>
          <Shimmer className={styles.field_shimmer} />
          <Shimmer className={styles.field_shimmer} />
          <Shimmer className={styles.field_shimmer} />
          <Shimmer className={styles.editor_shimmer} />
        </div>
      );
    }
    return (
      <>
        <EmailFields callerSource={callerSource} />
        <AdvancedEditor
          value={fields.contentHTML}
          onValueChange={(val) => {
            setFields({ contentHTML: val });
          }}
          customStyleClass={styles.editor}
          placeholderText={CONSTANTS.EDITOR_PLACEHOLDER}
          mailMergeOptions={emailConfig?.mailMergeOptions || []}
          mailMergeMenuTitle={emailConfig?.leadRepresentationName?.SingularName}
          callerSource={callerSource}
        />
        {fields?.attachments?.length ? (
          <AttachedFilesRenderer
            attachments={fields.attachments}
            setAttachments={handleAttachmentUpdate}
          />
        ) : null}
      </>
    );
  };

  return <SideModal.Body customStyleClass={styles.body_wrapper}>{getBody()}</SideModal.Body>;
};

export default Body;
