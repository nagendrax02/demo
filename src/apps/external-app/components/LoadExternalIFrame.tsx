import { trackError } from 'common/utils/experience/utils/track-error';
import IFrame from 'common/component-lib/iframe';
import { useEffect, useState } from 'react';
import { publishExternalAppEvent } from '../event-handler';

const LoadExternalIFrame = (): JSX.Element => {
  const [showSpinner, setShowSpinner] = useState(true);
  const EXTERNAL_APP_CHECK = 'isExternalApp';
  const EXTERNAL_URL = 'url';

  const getUrlFromParams = (): string => {
    try {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      params.delete(EXTERNAL_APP_CHECK);
      const augmentedUrl = params.get(EXTERNAL_URL);
      params.delete(EXTERNAL_URL);
      return augmentedUrl
        ? `${augmentedUrl}${augmentedUrl.includes('?') ? '&' : '?'}${params.toString()}`
        : '';
    } catch (error) {
      trackError(error);
      return '';
    }
  };

  useEffect(() => {
    if (!showSpinner) {
      publishExternalAppEvent('lsq-marvin-external-app-load', {
        data: {
          url: getUrlFromParams()
        }
      });
    }
  }, [showSpinner]);

  return (
    <IFrame
      id={'external-app-url'}
      src={getUrlFromParams()}
      showSpinner={showSpinner}
      setShowSpinner={setShowSpinner}
    />
  );
};

export default LoadExternalIFrame;
