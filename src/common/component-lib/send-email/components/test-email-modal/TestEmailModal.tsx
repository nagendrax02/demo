import { lazy, useState } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import styles from './test-email.module.css';
import { CONSTANTS } from '../../constants';
import { Variant } from 'common/types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { DEFAULT_MESSAGE_LENGTH } from 'apps/entity-details/entity-action/lead-share/constants';
import { CallerSource } from 'common/utils/rest-client';
import useSendEmailStore from '../../send-email.store';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { testEmails, validateInput } from './utils';
import { useNotificationStore } from '@lsq/nextgen-preact/notification';
import { trackError } from 'common/utils/experience';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { handleEmailError } from '../../SendEmailException';
const TextArea = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/text-area')));
const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const TestEmailModal = ({
  setShow,
  setIsDisabled,
  callerSource,
  leadTypeInternalName
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  callerSource: CallerSource;
  leadTypeInternalName?: string;
}): JSX.Element => {
  const [testEmailIds, setTestEmailIds] = useState(getItem(StorageKey.TestEmails) || '');
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { fields } = useSendEmailStore();

  const { setNotification } = useNotificationStore();

  const bodyContent = {
    description: 'You can send test email to multiple addresses separating them with commas.',
    exampleText: 'Ex: xyz@mail.com, qwe@mail.com,...'
  };

  const handleTestEmailClick = async (): Promise<void> => {
    setIsLoading(true);
    const isValid = validateInput({ testEmailIds, setErr });
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    try {
      await testEmails({
        fields,
        testEmailIds,
        callerSource,
        setNotification,
        leadTypeInternalName
      });
      setItem(StorageKey.TestEmails, testEmailIds);
      setIsDisabled(false);
      setShow(false);
      setIsLoading(false);
    } catch (error) {
      trackError(error);
      handleEmailError(error, leadTypeInternalName);
      setIsDisabled(true);
      setShow(false);
      setIsLoading(false);
    }
  };

  const handleEmailOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setErr('');
    setTestEmailIds(e.target.value);
  };

  return (
    <Modal show customStyleClass={styles.modal}>
      <Modal.Header
        title={CONSTANTS.TEST_EMAIL_CONTENT}
        description={CONSTANTS.TEST_EMAIL_HEADER_DESCRIPTION}
        onClose={() => {
          setShow(false);
        }}
        customStyleClass={styles.header}
      />
      <Modal.Body>
        <div className={styles.body}>
          <label htmlFor="email" className={styles.input_label}>
            Email Address<span className={styles.mandatory_asterisk}>*</span>
          </label>
          <TextArea
            id="email"
            handleMessageChange={handleEmailOnChange}
            message={testEmailIds}
            placeholder="Enter Text"
            maxLength={DEFAULT_MESSAGE_LENGTH}
            error={!!err}
          />
          <div className={styles.error}>{err}</div>
          <div className={styles.body_description}>
            <div>{bodyContent.description}</div>
            <div>{bodyContent.exampleText}</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.footer}>
          <Button
            text={CONSTANTS.CANCEL}
            variant={Variant.Secondary}
            onClick={() => {
              setShow(false);
            }}
          />
          <Button
            text={CONSTANTS.SEND_TEST_EMAIL}
            variant={Variant.Primary}
            onClick={handleTestEmailClick}
            isLoading={isLoading}
            icon={
              <Icon
                name="science"
                variant={IconVariant.Filled}
                customStyleClass={styles.send_test_email_btn_icon}
              />
            }
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TestEmailModal;
