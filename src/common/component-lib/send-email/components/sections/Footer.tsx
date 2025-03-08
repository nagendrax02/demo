import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useState } from 'react';
import SideModal from '@lsq/nextgen-preact/side-modal';
import styles from './sections.module.css';
import useSendEmailStore from '../../send-email.store';
import SaveTemplateModal from '../save-template-modal';
import ScheduleEmail from '../schedule-email-modal/ScheduleEmailModal';
import { getFooter } from './utils';
import FileLibrary from 'common/component-lib/file-library';
import { IFile } from 'common/component-lib/file-library/file-library.types';
import { CallerSource } from 'common/utils/rest-client';
import TestEmailModal from '../test-email-modal';
import ConfirmationMaodal from '../confirmation-modal';
import { isConfirmModalEnbaled } from '../confirmation-modal/utils';

interface IFooter {
  onSend: (scheduledTime?: string) => Promise<void>;
  onTemplateSave: (templateName: string, publish?: boolean) => Promise<void>;
  validateEmailData: () => void;
  callerSource: CallerSource;
  enableTestEmailFeature?: boolean;
  leadTypeInternalName?: string;
}

const Footer = ({
  onSend,
  onTemplateSave,
  validateEmailData,
  callerSource,
  enableTestEmailFeature,
  leadTypeInternalName
}: IFooter): JSX.Element => {
  const { isLoading, sendingEmail, options, fields, setFields, setSendingEmail } =
    useSendEmailStore();
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState<boolean>(false);
  const [showScheduleEmailModal, setShowScheduleEmailModal] = useState(false);
  const [showFileLibrary, setShowFileLibrary] = useState(false);
  const [showTestEmailModal, setShowTestEmailModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(enableTestEmailFeature);
  const [showConfirmationModal, setShowConfirmationModal] = useState(true);

  useEffect(() => {
    if (enableTestEmailFeature && !isDisabled) {
      setIsDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields?.contentHTML]);

  const handleSaveTemplateModal = (): void => {
    try {
      validateEmailData();
      setShowSaveTemplateModal(true);
    } catch (err) {
      trackError(err);
    }
  };

  const handleScheduleEmailModal = (): void => {
    try {
      validateEmailData();
      setShowScheduleEmailModal(true);
    } catch (err) {
      trackError(err);
    }
  };

  const handleFileLibrary = (): void => {
    setShowFileLibrary(true);
  };

  const handleFileSelect = (newFiles: IFile[]): void => {
    const temp = [...fields.attachments];
    temp.push(...newFiles);
    setFields({ attachments: temp });
  };

  const handleTestEmail = (): void => {
    try {
      validateEmailData();
      setShowTestEmailModal(true);
    } catch (err) {
      trackError(err);
    }
  };

  const handleSend = async (): Promise<void> => {
    try {
      setSendingEmail(true);
      const response = await isConfirmModalEnbaled(callerSource);
      if (response) {
        await onSend();
      } else {
        setShowConfirmationModal(response);
      }
      setSendingEmail(false);
    } catch (error) {
      trackError(error);
      setSendingEmail(false);
    }
  };

  return (
    <>
      {!showConfirmationModal ? (
        <ConfirmationMaodal
          setShowConfirmationModal={setShowConfirmationModal}
          onSend={onSend}
          isLoading={sendingEmail}
          callerSource={callerSource}
        />
      ) : null}
      {showFileLibrary ? (
        <FileLibrary
          setShow={setShowFileLibrary}
          onFilesSelect={handleFileSelect}
          showFooter
          callerSource={callerSource}
        />
      ) : null}
      {showSaveTemplateModal ? (
        <SaveTemplateModal setShow={setShowSaveTemplateModal} onSave={onTemplateSave} />
      ) : null}
      {showScheduleEmailModal ? (
        <ScheduleEmail setShow={setShowScheduleEmailModal} scheduleEmail={onSend} />
      ) : null}
      {showTestEmailModal ? (
        <TestEmailModal
          setShow={setShowTestEmailModal}
          setIsDisabled={setIsDisabled}
          callerSource={callerSource}
          leadTypeInternalName={leadTypeInternalName}
        />
      ) : null}
      <SideModal.Footer>
        <div className={styles.footer}>
          {getFooter({
            isLoading: isLoading,
            handleSaveTemplateModal: handleSaveTemplateModal,
            handleScheduleEmailModal: handleScheduleEmailModal,
            handleFileLibrary: handleFileLibrary,
            sendingEmail: sendingEmail,
            options: options,
            onSend: enableTestEmailFeature ? handleSend : onSend,
            enableTestEmailFeature: enableTestEmailFeature,
            isDisabled: isDisabled,
            handleTestEmail: handleTestEmail
          })}
        </div>
      </SideModal.Footer>
    </>
  );
};

export default Footer;
