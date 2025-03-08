import { useEffect, useMemo, useRef, useState } from 'react';
import { getApiUrl } from 'common/utils/helpers';
import { PlatformBaseURL, Events } from './constant';
import IFrame from 'common/component-lib/iframe';
import { setDocumentTitle } from 'common/utils/helpers/page-title';
import styles from './platform.module.css';
import { trackError } from 'common/utils/experience';
import { UnexpectedError } from 'src/common/component-lib/error-page';
import { setLocation } from 'src/router/utils/helper';

interface IPlatformPage {
  frameUrl: string;
}

interface ISWLiteEventData {
  type: Events;
  title: string;
  path: string;
}

const PlatformPage = (props: IPlatformPage): JSX.Element => {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [isIFrameLoading, setIsIFrameLoading] = useState(true);

  const getValidFrameUrl = (): string | undefined => {
    const platformBaseUrl: string = getApiUrl(PlatformBaseURL);
    if (props.frameUrl && platformBaseUrl) {
      try {
        return new URL(props.frameUrl, platformBaseUrl).toString();
      } catch (error) {
        trackError(error);
      }
    }
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent<ISWLiteEventData>): void => {
      const platformBaseUrl: string = getApiUrl(PlatformBaseURL);
      if (event.origin !== platformBaseUrl) return;

      const { type, title, path } = event.data;

      switch (type) {
        case Events.PageInit:
          ref.current?.contentWindow?.postMessage({ type, enabled: true }, platformBaseUrl);
          break;
        case Events.PageLoading:
          setIsIFrameLoading(true);
          break;
        case Events.PageLoaded:
          history.replaceState({}, title, path);
          setDocumentTitle(title);
          break;
        case Events.Navigate:
          setLocation(path);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  const frameUrl = useMemo(() => getValidFrameUrl(), [props.frameUrl]);

  return (
    <div className={styles.container}>
      {frameUrl ? (
        <IFrame
          customStyleClass={styles.iframe}
          customRef={ref}
          id="sw-lite-platform-page"
          src={frameUrl}
          augmentSrc={false}
          setShowSpinner={setIsIFrameLoading}
          showSpinner={isIFrameLoading}
        />
      ) : (
        <UnexpectedError
          variant="error"
          handleRefresh={() => {
            document.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default PlatformPage;
