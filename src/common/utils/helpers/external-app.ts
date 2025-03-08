import { IModuleConfig } from 'common/types/authentication.types';
import {
  EXTERNAL_APP_GLOBAL_OBJ_KEY,
  EXTERNAL_APP_GLOBAL_PROMISE_KEY,
  EXTERNAL_APP_VISIBILITY_CHECK_KEY
} from 'common/constants';
import { IControllablePromise, IExternalMenuHandler } from './helpers.types';
import { getPersistedAuthConfig } from '../authentication/utils/authentication-utils';

export const getExternalAppsConfig = (): IModuleConfig[] => {
  const moduleConfig = getPersistedAuthConfig()?.ModulesConfig || {};
  return Object.values(moduleConfig)?.filter((app) => app?.IsExternal);
};

export const getExternalAppPromise = (name: string): IControllablePromise | undefined => {
  return window[EXTERNAL_APP_GLOBAL_PROMISE_KEY.replace('{{name}}', name)] as
    | IControllablePromise
    | undefined;
};

export const getExternalAppHandler = (name: string): IExternalMenuHandler => {
  return window[EXTERNAL_APP_GLOBAL_OBJ_KEY.replace('{{name}}', name)] as IExternalMenuHandler;
};

export const getExternalAppVisibilityCheck = (name: string): IControllablePromise | undefined => {
  return window[EXTERNAL_APP_VISIBILITY_CHECK_KEY.replace('{{name}}', name)] as
    | IControllablePromise
    | undefined;
};
