import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, httpGet, Module } from 'common/utils/rest-client';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { IActivityMetaData } from '../activity/activity.types';
import { EntityType } from '../common-utils/common.types';
import { API_ROUTES } from 'common/constants';

export const getAccountActivityMetaData = async (
  code: number,
  callerSource: CallerSource
): Promise<IActivityMetaData> => {
  let result: IActivityMetaData = {
    Id: '',
    Code: 0,
    Name: '',
    DisplayName: '',
    PluralName: '',
    EntityType: EntityType.Account,
    Score: 0,
    CanDelete: false,
    Fields: []
  };

  try {
    const storageKey = StorageKey.AccountActivityMetaData;
    const cachedResponse = (getItem(storageKey) as Record<number, IActivityMetaData>) || {};
    let response = cachedResponse?.[code];
    if (!response) {
      response = (await httpGet({
        path: `${API_ROUTES.accountActivityMetadata}?activityCode=${code}`,
        module: Module.Marvin,
        callerSource: callerSource
      })) as IActivityMetaData;
      cachedResponse[code] = response;
      setItem(storageKey, cachedResponse);
    }
    if (response) result = response as IActivityMetaData;
  } catch (err) {
    trackError(err);
  }
  return result;
};
