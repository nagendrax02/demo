import styles from './email-body.module.css';
import { IAugmentedEmailData } from '../../subject.type';
import IframeEmbedHtml from '../iframe-embed-html';
import { Suspense } from 'react';

interface IEmailBody {
  data: IAugmentedEmailData;
}

const EmailBody = ({ data }: IEmailBody): JSX.Element => {
  return (
    <div data-testid="email-body" className={styles.email_body} id="email-body">
      <Suspense fallback={<></>}>
        <IframeEmbedHtml content={data.body} disableOpenInNewTab />
      </Suspense>
    </div>
  );
};

export default EmailBody;
