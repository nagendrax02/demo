import EmailInfo from '../../../email/components/subject/components/email-header/EmailInfo';
import { labelKeys, mailKeys } from './constants';
import styles from './connector-email.module.css';
import Title from './Title';

interface IEmailModalBody {
  eventNoteRecord: {
    [key: string]: string;
  } | null;
  isConnectorEmailOnS3: boolean;
}

const EmailModalBody = (props: IEmailModalBody): JSX.Element => {
  const { eventNoteRecord, isConnectorEmailOnS3 } = props;

  return eventNoteRecord ? (
    <>
      {Object.keys(eventNoteRecord)?.map((key) => (
        <div key={key} className={styles.email_info}>
          {key.toLowerCase() === mailKeys.Body ? (
            <div className={styles.email_body}>
              <Title
                data={eventNoteRecord[key]}
                isConnectorEmailOnS3={isConnectorEmailOnS3}
                key={key}
              />
            </div>
          ) : (
            <EmailInfo
              label={labelKeys[key.toLowerCase()] as string}
              title={
                <Title
                  data={eventNoteRecord[key]}
                  isConnectorEmailOnS3={isConnectorEmailOnS3}
                  key={key}
                />
              }
            />
          )}
        </div>
      ))}
    </>
  ) : (
    <></>
  );
};

export default EmailModalBody;
