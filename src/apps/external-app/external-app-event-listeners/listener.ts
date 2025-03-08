import { trackError } from 'common/utils/experience/utils/track-error';
import processor from './event-processor';
import scriptLoader from '../utils/script-loader';
import { getExternalAppPromise, getExternalAppsConfig } from 'common/utils/helpers/external-app';
import {
  isListeningExternalAppEvents,
  setExternalAppListener
} from '../event-handler/event-handler.store';
import { IModuleConfig } from 'common/types/authentication.types';
import { ENV_CONFIG } from 'common/constants';
import { IExternalApp, ResourceLoadingMode } from '../external-app.types';

const messageEventHandler = (event: MessageEvent): void => {
  try {
    if (event?.data?.type) {
      console.log('External-app:Events', event?.data?.type);
      processor[event?.data?.type?.toLowerCase() || processor.default]?.(event);
    }
  } catch (ex) {
    trackError('Error in event processor :', ex);
  }
};

const externalAppEventsListener = {
  start: (): void => {
    if (isListeningExternalAppEvents()) return;
    setExternalAppListener(true);
    window.addEventListener('message', messageEventHandler);
  },
  stop: (): void => {
    window.removeEventListener('message', messageEventHandler);
    setExternalAppListener(false);
  }
};

const getScriptDelay = (appName: string): number => {
  if (appName === 'CONVERSE_APP_WIDGET') return 500;
  if (appName === 'carter-app-menu') return 1000;
  return 0;
};

const handleOnLoad = (name: string): void => {
  const controllablePromise = getExternalAppPromise(name);
  controllablePromise?.resolve?.('');
};

const handleOnError = (name: string): void => {
  const controllablePromise = getExternalAppPromise(name);
  controllablePromise?.reject?.('');
};

export const loadScriptForMip = (): void => {
  const apps = (self?.[ENV_CONFIG.envKey]?.[ENV_CONFIG.externalApp] || {}) as Record<
    string,
    IExternalApp
  >;
  Object.keys(apps)?.forEach((appName: string) => {
    if (apps[appName].Mode === ResourceLoadingMode.Script) {
      scriptLoader({ id: appName, url: apps[appName].Url });
    }
  });
};

const loadScriptForStandalone = (): void => {
  const apps = getExternalAppsConfig();
  if (!apps) return;
  apps?.forEach((app: IModuleConfig) => {
    if (!app?.ExternalAppConfig?.ScriptURL) {
      return;
    }

    scriptLoader({
      id: app?.Name,
      url: app?.ExternalAppConfig?.ScriptURL,
      delay: getScriptDelay(app?.Name),
      onLoad: () => {
        handleOnLoad(app?.Name);
      },
      onError: () => {
        handleOnError(app?.Name);
      }
    });
  });
};

export { externalAppEventsListener, loadScriptForStandalone };
