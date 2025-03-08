import { useEffect } from 'react';
import { APP_VISIBILITY_CHANGED } from 'common/constants';
import {
  clearRunningExperience,
  ExperienceType,
  getExperienceKey,
  startExperience,
  trackError
} from 'common/utils/experience';
import { addFaviconUrlFromLaunchConfig } from 'common/utils/authentication/utils/authentication-utils';
import { isMiP } from 'common/utils/helpers';

function useLayout(): void {
  if (isMiP()) {
    const experienceConfig = getExperienceKey();
    startExperience({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      key: experienceConfig.key
    });
  }
  addFaviconUrlFromLaunchConfig();
  useEffect(() => {
    const visibilityListener = (): void => {
      try {
        window[APP_VISIBILITY_CHANGED] = true;
        clearRunningExperience();
      } catch (error) {
        trackError(error);
      }
    };
    try {
      document?.addEventListener('visibilitychange', visibilityListener);
    } catch (error) {
      trackError(error);
    }

    return (): void => {
      document?.removeEventListener('visibilitychange', visibilityListener);
    };
  }, []);
}

export default useLayout;
