import { API_ROUTES } from 'common/constants';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { trackError } from 'common/utils/experience';
import { CONSTANTS } from '../../constants';

export const isConfirmModalEnbaled = async (callerSource: CallerSource): Promise<boolean> => {
  try {
    const cachedData = getItem<boolean>(StorageKey.HideSendEmailConfirmationModal);
    if (cachedData) {
      return cachedData;
    }
    const response: boolean = await httpGet({
      path: `${API_ROUTES.cacheGet}${CONSTANTS.DO_NOT_SHOW_LIST_SEND_EMAIL_CONFIRMATION}`,
      module: Module.Cache,
      callerSource: callerSource
    });
    setItem(StorageKey.HideSendEmailConfirmationModal, !!response);
    return !!response;
  } catch (error) {
    trackError(error);
  }
  return false;
};
