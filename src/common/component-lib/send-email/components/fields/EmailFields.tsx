import { CallerSource } from 'src/common/utils/rest-client';
import useSendEmailStore from '../../send-email.store';
import Transition from '../transition';
import Bcc from './Bcc';
import Cc from './Cc';
import EmailCategories from './EmailCategories';
import From from './From';
import ReplyTo from './ReplyTo';
import Subject from './Subject';
import To from './To';
import styles from './email-fields.module.css';

const EmailFields = ({ callerSource }: { callerSource: CallerSource }): JSX.Element => {
  const { options, emailConfig } = useSendEmailStore();
  const showEmailCategories = !!emailConfig?.emailCategories?.length;

  return (
    <div className={styles.field_wrapper}>
      {showEmailCategories ? <EmailCategories /> : null}
      <To />
      {options.showCc ? (
        <Transition fadeInStyleClass={styles.fade_in} fadeOutStyleClass={styles.fade_out}>
          <Cc callerSource={callerSource} />
        </Transition>
      ) : null}
      {options.showBcc ? (
        <Transition fadeInStyleClass={styles.fade_in} fadeOutStyleClass={styles.fade_out}>
          <Bcc callerSource={callerSource} />
        </Transition>
      ) : null}
      <From callerSource={callerSource} />
      {options?.showReplyTo ? <ReplyTo callerSource={callerSource} /> : null}
      <Subject />
    </div>
  );
};

export default EmailFields;
