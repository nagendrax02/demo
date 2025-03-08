import IFrame from 'common/component-lib/iframe';
import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { ICustomMenu } from '../custom-menu.types';
import { HttpMethod } from 'common/utils/rest-client';
import { handleCustomMenuIFrameUrl, updateUrl } from '../utils';
import { publishExternalAppEvent } from 'apps/external-app';

const CustomMenuIframe = ({
  selectedMenu,
  defaultIframeAttributes
}: {
  selectedMenu: ICustomMenu;
  defaultIframeAttributes: string;
}): JSX.Element => {
  const appConfig = selectedMenu?.AppConfig;
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async (): Promise<void> => {
      if (!appConfig?.AppURL?.URL) return;
      const appUrlMethod = appConfig?.AppURL?.Method?.toUpperCase() as HttpMethod;

      await handleCustomMenuIFrameUrl({
        appUrl: appConfig?.AppURL?.URL,
        appUrlMethod: appUrlMethod,
        setIframeUrl,
        customId: selectedMenu?.customId
      });

      updateUrl(selectedMenu.Id, selectedMenu?.parentId);

      publishExternalAppEvent('lsq-marvin-external-app-load', {
        data: {
          url: window.location.href
        }
      });

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenu?.customId]);

  return (
    <IFrame
      customStyleClass={styles.iframe}
      id={selectedMenu.Id}
      src={iframeUrl}
      showSpinner={isIframeLoading || isLoading}
      setShowSpinner={setIsIframeLoading}
      attributes={{
        loading: 'eager',
        sandbox: `${appConfig?.IframeAttributes || defaultIframeAttributes}`
      }}
    />
  );
};

export default CustomMenuIframe;
