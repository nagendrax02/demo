import { API_ROUTES, APP_SOURCE } from 'common/constants';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { updateCheckinDate, updateCheckInStatus } from './checkin-checkout.store';
import { INotification, Type } from '@lsq/nextgen-preact/notification/notification.types';
import { CICOSuccessMsg } from '../constants';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { trackError } from 'common/utils/experience/utils/track-error';

export const handleCheckoutAndLogout = async ({
  checkout,
  showAlert
}: {
  checkout?: boolean;
  showAlert: (notification: INotification) => void;
}): Promise<void> => {
  if (checkout) {
    try {
      await httpPost({
        path: API_ROUTES.userCheckout,
        module: Module.Marvin,
        body: { Source: APP_SOURCE },
        callerSource: CallerSource.MiPNavMenu
      });
      updateCheckinDate();
      updateCheckInStatus(true);
      showAlert({
        type: Type.SUCCESS,
        message: CICOSuccessMsg.CheckedIn
      });
    } catch (err) {
      showAlert({ type: Type.ERROR, message: ERROR_MSG.generic });
    }
  }
  try {
    const module = await import('common/utils/authentication/utils/logout');
    module.logout();
  } catch (ex) {
    trackError(ex);
  }
};
