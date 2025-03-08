import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import {
  StorageKey,
  UserPersonalisationKeys,
  getItem,
  setItem
} from 'common/utils/storage-manager';
import { ISelectedLeadFilterOption } from './components/filters/account-lead-filter/accountLeadFilter.types';
import { getUserPersonalisation, setUserPersonalisation } from 'common/utils/user-personalisation';
import { CallerSource } from 'common/utils/rest-client';
import { EntityType } from 'common/types/entity.types';

interface ISetStoreFilter {
  type: EntityType;
  data: IOption[];
  entityDetailId?: string;
  isAccountLeadActivityHistoryTab?: boolean;
}

interface IGetStoreFilter {
  type: EntityType;
  entityDetailId: string;
  isAccountLeadActivityHistoryTab?: boolean;
}

export const canStoreInRemoteCache = (
  type: EntityType,
  isAccountLeadActivityHistoryTab?: boolean
): boolean => {
  return !isAccountLeadActivityHistoryTab && type === EntityType.Lead;
};

export const getTypeFilter = async ({
  type,
  entityDetailId,
  isAccountLeadActivityHistoryTab
}: IGetStoreFilter): Promise<IOption[]> => {
  try {
    if (canStoreInRemoteCache(type, isAccountLeadActivityHistoryTab)) {
      return (
        (await getUserPersonalisation<IOption[]>(
          `${type}-${UserPersonalisationKeys.AHTypeFilter}`,
          CallerSource.ActivityHistory
        )) || []
      );
    } else {
      const options = (getItem(StorageKey.AHEventsCodes) as Record<string, IOption[]>) || {};
      return options?.[`${type}-${entityDetailId}`] || [];
    }
  } catch (error) {
    trackError(error);
    return [];
  }
};

export const storeTypeFilter = async ({
  type,
  data,
  entityDetailId,
  isAccountLeadActivityHistoryTab
}: ISetStoreFilter): Promise<void> => {
  try {
    if (canStoreInRemoteCache(type, isAccountLeadActivityHistoryTab)) {
      await setUserPersonalisation<IOption[]>(
        `${type}-${UserPersonalisationKeys.AHTypeFilter}`,
        CallerSource.ActivityHistory,
        data
      );
    } else {
      const options = (getItem(StorageKey.AHEventsCodes) as Record<string, IOption[]>) || {};
      options[`${type}-${entityDetailId}`] = data;
      setItem(StorageKey.AHEventsCodes, options);
    }
  } catch (error) {
    trackError(error);
  }
};

export const removeSpecificItem = (key: StorageKey, property: string): void => {
  if (getItem(key)) {
    const storedItem = getItem(key) as Record<string, IOption[]>;
    if (storedItem?.[property]) {
      storedItem[property] = [];
      setItem(key, storedItem);
    }
  }
};

export const cacheAccountLeadFilter = (
  type: EntityType,
  entityDetailId: string,
  data: ISelectedLeadFilterOption[]
): void => {
  const options =
    (getItem(StorageKey.AHLeadEventsCodes) as Record<string, ISelectedLeadFilterOption[]>) || {};
  options[`${type}-${entityDetailId}`] = data;
  setItem(StorageKey.AHLeadEventsCodes, options);
};

export const getCachedAccountLeadFilter = (
  type: EntityType,
  entityDetailId: string
): ISelectedLeadFilterOption[] => {
  const options =
    (getItem(StorageKey.AHLeadEventsCodes) as Record<string, ISelectedLeadFilterOption[]>) || {};
  return options?.[`${type}-${entityDetailId}`] || [];
};
