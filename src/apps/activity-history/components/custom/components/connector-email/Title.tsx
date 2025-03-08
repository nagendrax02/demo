import { useEffect, useState } from 'react';
import IframeEmbedHtml from '../../../email/components/subject/components/iframe-embed-html';
import { connectEmailActivityKeys, mailKeys } from './constants';
import { getIFrameContent, getIFrameUrl, isValidUrl } from './utils';
import { getFormattedDateTime } from 'common/utils/date';
import { getPurifiedContent } from 'common/utils/helpers';
import styles from './connector-email.module.css';

interface ITitle {
  key: string;
  data: string;
  isConnectorEmailOnS3: boolean;
}

const Title = (props: ITitle): JSX.Element => {
  const { key, data, isConnectorEmailOnS3 } = props;

  const [component, setComponent] = useState<JSX.Element>();

  const getS3MailValue = async (value: string): Promise<JSX.Element> => {
    if (
      value?.includes(connectEmailActivityKeys.CONTENT_URL_STARTS) &&
      value?.includes(connectEmailActivityKeys.CONTENT_URL_ENDS)
    ) {
      const url = getIFrameUrl(value);
      if (await isValidUrl(url)) {
        return <iframe src={url} className={styles.iframe} />;
      }
      const content = getIFrameContent(value);
      return <IframeEmbedHtml content={content} />;
    }
    return <>{value}</>;
  };

  const getMailValue = async (value: string): Promise<JSX.Element> => {
    if (
      value?.includes(connectEmailActivityKeys.CONTENT_STARTS) &&
      value?.includes(connectEmailActivityKeys.CONTENT_ENDS)
    ) {
      const pattern = /{htmlcontentstarts}|{htmlcontentends}/gi;
      const contentArray = value?.split(pattern);
      return (
        <>
          <IframeEmbedHtml content={contentArray[1]} />
          {contentArray?.[2] ? <>{contentArray[2]}</> : null}
        </>
      );
    } else if (value?.includes(connectEmailActivityKeys.CONTENT_STARTS)) {
      const pattern = /{htmlcontentstarts}/gi;
      const contentArray = value.split(pattern);
      return (
        <>
          <IframeEmbedHtml content={contentArray[1]} />
          {contentArray?.[2] ? <>{contentArray[2]}</> : null}
        </>
      );
    } else {
      const purifiedContent = await getPurifiedContent(value);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      return <div dangerouslySetInnerHTML={{ __html: purifiedContent }} />;
    }
  };

  useEffect(() => {
    (async (): Promise<void> => {
      const augmentedData =
        key === mailKeys.MailReceived ? getFormattedDateTime({ date: data }) : data;
      const componentToRender = isConnectorEmailOnS3
        ? await getS3MailValue(augmentedData)
        : await getMailValue(augmentedData);

      setComponent(componentToRender);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return component || <></>;
};

export default Title;
