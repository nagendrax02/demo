import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { getFromDB, setInDB, StorageKey } from 'common/utils/storage-manager';
import { IDateOption } from 'common/component-lib/date-filter';

export const getTypeFilterSelectedValueFromCache = async (): Promise<IOption[] | undefined> => {
  const cachedData = await getFromDB(StorageKey.AuditTrailTypeFilter);
  if (cachedData) return cachedData as IOption[];
  return undefined;
};

export const setTypeFilterSelectedValueInCache = async (
  selectedValue: IOption[]
): Promise<void> => {
  await setInDB(StorageKey.AuditTrailTypeFilter, selectedValue);
};

export const getDateFilterSelectedValueFromCache = async (): Promise<IDateOption | undefined> => {
  const cachedData = await getFromDB(StorageKey.AuditTrailDateFilter);
  if (cachedData) {
    return cachedData as IDateOption;
  }
  return undefined;
};

export const setDateFilterSelectedValueInCache = async (
  selectedValue: IDateOption
): Promise<void> => {
  await setInDB(StorageKey.AuditTrailDateFilter, selectedValue);
};
