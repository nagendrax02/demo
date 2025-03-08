import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants';
import { CallerSource, httpGet, Module } from '../rest-client';
import { AvailableTheme, getCurrentTheme } from '@lsq/nextgen-preact/v2/stylesmanager';

const getPersonalizationCacheData = async ({
  cacheKey,
  callerSource
}: {
  cacheKey: string;
  callerSource: CallerSource;
}): Promise<string | undefined> => {
  try {
    return await httpGet({
      path: `${API_ROUTES.cacheGet}${cacheKey}`,
      module: Module.Cache,
      callerSource
    });
  } catch (error) {
    trackError(error);
  }
  return undefined;
};

const PERSONALIZATION_CACHE_KEY = {
  SelectedTheme: 'selected-theme'
};

const getUserSelectedTheme = async (): Promise<AvailableTheme> => {
  try {
    const selectedThemeFromLS = getCurrentTheme();
    if (!selectedThemeFromLS) {
      return (await getPersonalizationCacheData({
        cacheKey: PERSONALIZATION_CACHE_KEY.SelectedTheme,
        callerSource: CallerSource.Authentication
      })) as AvailableTheme;
    }
    return selectedThemeFromLS;
  } catch (error) {
    trackError(error);
    return AvailableTheme.Default;
  }
};

export { PERSONALIZATION_CACHE_KEY, getUserSelectedTheme };
export default getPersonalizationCacheData;
