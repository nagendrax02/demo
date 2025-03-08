import { trackError } from 'common/utils/experience/utils/track-error';

const clearCache = (): void => {
  try {
    caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))));
  } catch (err) {
    trackError(err);
  }
};

const handleReload = (): void => {
  clearCache();
  self.location.reload();
};

export { handleReload, clearCache };
