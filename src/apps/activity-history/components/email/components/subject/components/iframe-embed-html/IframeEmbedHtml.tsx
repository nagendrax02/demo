import { useEffect, useRef, useState } from 'react';
import styles from './iframe-embed-html.module.css';
import { getPurifiedContent } from 'common/utils/helpers';

export interface IIFrameEmbedHtml {
  content: string;
  disableOpenInNewTab?: boolean;
}

const IframeEmbedHtml = ({ content, disableOpenInNewTab }: IIFrameEmbedHtml): JSX.Element => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isHtmlEmbedded, setIsHtmlEmbedded] = useState(false);

  useEffect(() => {
    const embedContent = async (): Promise<void> => {
      try {
        if (iframeRef.current && !isHtmlEmbedded) {
          const htmlDocument = iframeRef.current?.contentWindow?.document;
          const sanitizeHTML = await getPurifiedContent(
            content ?? '',
            undefined,
            disableOpenInNewTab
          );
          if (htmlDocument) {
            htmlDocument.open();
            htmlDocument.write(sanitizeHTML);
            htmlDocument.close();
            setIsHtmlEmbedded(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    embedContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const onLoad = (): void => {
    try {
      if (iframeRef.current?.contentWindow?.document.body) {
        iframeRef.current.style.height = `${
          iframeRef.current.contentWindow.document.body.scrollHeight || 0
        }px`;
        iframeRef.current.style.border = 'none';
        const htmlDocument = iframeRef.current?.contentWindow?.document;
        if (htmlDocument) {
          const documentBody = htmlDocument.body;
          documentBody.style.height = '100%';
          documentBody.style.overflowY = 'hidden';
          const metaData = document.createElement('meta');
          metaData.name = 'viewport';
          metaData.content = 'width=device-width, initial-scale=1.0';
          htmlDocument.head.appendChild(metaData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.iframe_embed_html}>
      <iframe
        src="about:blank"
        ref={iframeRef}
        className={styles.iframe_embed_html}
        height="100%"
        width="100%"
        onLoad={onLoad}
      />
    </div>
  );
};

IframeEmbedHtml.defaultProps = {
  disableOpenInNewTab: undefined
};

export default IframeEmbedHtml;
