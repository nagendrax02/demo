import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect } from 'react';
import { isFeatureEnabled } from '../utils/utils';

const useExternalAppListener = (): void => {
  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const module = await import('./listener');
        module.externalAppEventsListener.start();

        module.loadScriptForMip();

        if (isFeatureEnabled('enable-pendo')) {
          const pendo = await import('../pendo/pendo');
          pendo.initializePendo();
        }
        const wootric = await import('../wootric');
        wootric.loadWootricScript();
      } catch (error) {
        trackError(error);
      }
    })();
  }, []);
};

export { useExternalAppListener };
