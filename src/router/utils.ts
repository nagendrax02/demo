import { getPersistedAuthConfig } from 'common/utils/authentication';
import { IModuleConfig } from 'common/types/authentication.types';
import {
  EXTERNAL_APP_GLOBAL_OBJ_KEY,
  EXTERNAL_APP_GLOBAL_PROMISE_KEY,
  EXTERNAL_APP_VISIBILITY_CHECK_KEY
} from 'common/constants';
import { IExternalMenuHandler } from 'common/utils/helpers/helpers.types';
import { getExternalAppsConfig } from 'common/utils/helpers/external-app';
import { createControllablePromise } from 'common/utils/helpers/promise-helpers';

export const getRoutePathToAppMap = (): Record<string, IModuleConfig> => {
  const modulesConfig = getPersistedAuthConfig()?.ModulesConfig || {};
  return Object.values(modulesConfig)?.reduce((acc: Record<string, IModuleConfig>, appConfig) => {
    const routePath = appConfig?.RouteConfig?.RoutePath?.toLowerCase();
    if (routePath) {
      acc[routePath] = appConfig;
    }
    return acc;
  }, {});
};

export const addGlobalObjectForExternalApps = (
  setOnRenderRegistration: (name: string) => void
): void => {
  window['lsq-marvin-app'] = {
    registerNavMenuHandler: (name: string, handler: IExternalMenuHandler): void => {
      setOnRenderRegistration(name);
      window[EXTERNAL_APP_GLOBAL_OBJ_KEY.replace('{{name}}', name)] = handler;
    }
  };

  // add onLoad Promise for all external scripts to execute onRender functionality provided by external apps
  const externalApps = getExternalAppsConfig();
  Object.values(externalApps)?.forEach((appConfig) => {
    if (!appConfig?.ExternalAppConfig?.ScriptURL) {
      return;
    }

    window[EXTERNAL_APP_GLOBAL_PROMISE_KEY.replace('{{name}}', appConfig?.Name)] =
      createControllablePromise();
    window[EXTERNAL_APP_VISIBILITY_CHECK_KEY.replace('{{name}}', appConfig?.Name)] =
      createControllablePromise();
  });
};
