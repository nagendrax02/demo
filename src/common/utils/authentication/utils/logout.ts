import { isMiP } from '../../helpers';
import { clearStorage } from 'common/utils/storage-manager';
import { publishExternalAppEvent } from 'apps/external-app/event-handler';
import { redirectToDefaultRegionUrl } from './region-redirection-helpers';

export const redirectToLoginPage = (): void => {
  if (redirectToDefaultRegionUrl(false)) return;
  else window.location.replace('/');
};

export const logout = (): void => {
  clearStorage();
  publishExternalAppEvent('lsq-marvin-sign-out', { data: 'signed_out' });
  if (isMiP()) {
    window.location.href = '/Home/SignOut';
    return;
  } else {
    redirectToLoginPage();
  }
};
