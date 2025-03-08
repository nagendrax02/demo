import { trackError } from 'common/utils/experience/utils/track-error';
import { LSQ_REDIRECT_URL, RETURN_URL } from '../constant';
import { isMiP } from 'common/utils/helpers';

export const handleUrlFormat = (pathName: string): void => {
  try {
    if (isMiP()) return;

    const updatedUrl = new URL(`${window.location.origin}${decodeURIComponent(pathName)}`);
    window.history.pushState({}, '', updatedUrl?.toString());
  } catch (error) {
    trackError(error);
  }
};

export const getLSQRedirectedURL = (): string | null => {
  try {
    if (isMiP()) return null;

    if (window.location.href.includes(LSQ_REDIRECT_URL)) {
      const queryParams = new URLSearchParams(window.location.search);
      const redirectionPath = queryParams.get(RETURN_URL) || '';
      if (redirectionPath) {
        return `${window.location.origin}${decodeURIComponent(redirectionPath)}`;
      }
    }
  } catch (error) {
    trackError(error);
  }
  return null;
};
