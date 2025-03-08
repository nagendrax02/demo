import { trackError } from 'common/utils/experience/utils/track-error';
import { isValidGuid } from 'common/utils/helpers';
import { InMemoryStorageKey } from 'common/utils/storage-manager';
import { APP_ROUTE } from 'common/constants';
import { Path } from 'wouter';

export const setLocation = (path: Path): void => {
  try {
    const method = window[InMemoryStorageKey.SetLocation] as (
      to: Path,
      options?: {
        replace?: boolean;
      }
    ) => void;

    if (typeof method === 'function') method(path);
  } catch (error) {
    trackError(error);
  }
};

const isAccountDetailsRoute = (routePath: string[]): boolean => {
  if (!routePath) return false;
  // accountmanagement/type/guid - account details page
  // accountmanagement/type -> platform manage accounts page
  // below guid check differentiates between account details and manage accounts
  return (
    routePath?.[1]?.toLowerCase()?.startsWith?.('accountmanagement') &&
    isValidGuid(routePath?.[3]?.split('/')?.pop() ?? '')
  );
};

export const getRoute = (loc: string): string => {
  const routePath = window.location.pathname.split('/');
  if (isAccountDetailsRoute(routePath)) {
    return APP_ROUTE.accountmanagement;
  }
  return loc?.toLowerCase();
};
