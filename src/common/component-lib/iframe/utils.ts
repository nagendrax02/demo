import { trackError } from 'common/utils/experience/utils/track-error';
import { getPersistedAuthConfig } from 'common/utils/authentication';

const getValidURL = (url: string): string => {
  if (!url?.trim()) return '';
  const isValidUrl = url?.startsWith('http://') || url?.startsWith('https://');
  return isValidUrl ? url : `https://${url}`;
};

export const getSrc = (src: string): string => {
  try {
    if (!src?.trim()) return '';

    const validatedUrl = getValidURL(src);
    const url = new URL(validatedUrl);
    const token = getPersistedAuthConfig()?.Tokens?.Token || '';

    url.searchParams.set('lsqMarvinToken', encodeURI(token));
    url.searchParams.set('isMarvin', '1');

    return url?.toString();
  } catch (error) {
    trackError(error);
  }
  return getValidURL(src);
};
