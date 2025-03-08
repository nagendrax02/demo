import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect } from 'react';
import { generateAuthStorageData } from './marvin-authentication';
import { EventMessage } from './constants';
import { isMiP, safeParseJson } from '../helpers';
import { IInitDataToSend, IMarvinStorageData, IMessageEvent } from './marvin-helper.types';
import { getFromDB, StorageKey } from 'common/utils/storage-manager';
import { AvailableTheme, useTheme } from '@lsq/nextgen-preact/v2/stylesmanager';
import useFeatureRestrictionStore from '../feature-restriction/use-feature-restriction-store';

interface IUseMarvinComponent {
  iframeRef: React.MutableRefObject<HTMLIFrameElement | null>;
  initDataToSend: IInitDataToSend;
  onMessageReceive?: (data: unknown) => void;
  feature: string;
  isLoginPage?: boolean;
  appModule?: string;
}

interface IUserMarvinComponentResult {
  sendMessage: (payload: string) => void;
}

const useMarvinComponent = (config: IUseMarvinComponent): IUserMarvinComponentResult => {
  const { iframeRef, initDataToSend, onMessageReceive, feature, isLoginPage, appModule } = config;
  const { theme } = useTheme();
  const { restrictionData } = useFeatureRestrictionStore();

  const getAuthEventMessage = (
    storageData: IMarvinStorageData | null
  ): { storageData?: IMarvinStorageData; initData: IInitDataToSend } => {
    if (isLoginPage) {
      return { initData: initDataToSend };
    }
    if (!storageData) {
      throw new Error('Authentication token information not available');
    }
    return {
      storageData: {
        ...storageData,
        User: {
          ...storageData?.User,
          FirstName: storageData?.User?.FullName || ''
        },
        UserLanguage: 'en',
        ThemeConfig: (theme?.mode || AvailableTheme.Default) as AvailableTheme,
        appModule: appModule,
        FeatureRestrictionData: {
          userPermissionMap: Object.fromEntries(restrictionData?.userRestrictions),
          userActionsMap: Object.fromEntries(restrictionData?.userActions)
        }
      },
      initData: initDataToSend
    };
  };

  const authenticate = async (): Promise<void> => {
    try {
      const storageData = isMiP()
        ? generateAuthStorageData()
        : ((await getFromDB(StorageKey.PostLoginConfig)) as IMarvinStorageData);

      const payload = JSON.stringify({
        type: EventMessage.Type.Auth,
        message: getAuthEventMessage(storageData)
      });
      if (iframeRef?.current?.contentWindow) {
        // sending requested data to marvin SmartViews
        iframeRef.current.contentWindow?.postMessage(payload, '*');
      }
    } catch (error) {
      trackError(error);
    }
  };

  const handleEvent = async (event: MessageEvent): Promise<void> => {
    const data: IMessageEvent | null = safeParseJson(event?.data);
    if (data?.type === EventMessage.Type.Auth && feature === data?.message) {
      await authenticate();
      return;
    }
    if (isLoginPage && onMessageReceive) onMessageReceive(event);
    else if (data) onMessageReceive?.(data);
  };

  useEffect(() => {
    window.addEventListener('message', handleEvent);
    return () => {
      window.removeEventListener('message', handleEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = (payload: string): void => {
    try {
      if (iframeRef?.current?.contentWindow) {
        // sending data to marvin SmartViews
        iframeRef.current.contentWindow?.postMessage(payload, '*');
      }
    } catch (error) {
      trackError(error);
    }
  };

  return { sendMessage };
};

export default useMarvinComponent;
