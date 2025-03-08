import { trackError } from 'common/utils/experience/utils/track-error';
import { AUTHENTICATION, EventMessage } from './constant';
import { IUseMarvinAuthentication } from './authentication.type';
import { onLoginSuccess, onPageRedirection, updateWindowHistory } from './utils';
import { useTheme } from '@lsq/nextgen-preact/v2/stylesmanager';
import useMarvinComponent from 'common/utils/marvin-helper';

const useMarvinAuthentication = (config: IUseMarvinAuthentication): void => {
  const { setAuthStatus, iframeRef } = config;
  const { setTheme } = useTheme();

  const onMessageReceive = async (event: MessageEvent): Promise<void> => {
    try {
      if (event?.data?.type !== EventMessage.type) return;

      switch (event?.data?.action) {
        case EventMessage.action.loginSuccess:
          await onLoginSuccess({ event, setAuthStatus, setTheme });
          break;

        case EventMessage.action.pageRedirection:
          onPageRedirection(event);
          break;
        case EventMessage.action.locationHistoryUpdate:
          updateWindowHistory(event);
          break;
      }
    } catch (error) {
      trackError(error);
    }
  };

  useMarvinComponent({
    iframeRef: iframeRef,
    initDataToSend: {
      route: '/Authentication',
      payload: {}
    },
    onMessageReceive: onMessageReceive,
    feature: AUTHENTICATION,
    isLoginPage: true
  });
};

export default useMarvinAuthentication;
