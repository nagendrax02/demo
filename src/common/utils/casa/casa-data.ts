import { getItem, StorageKey } from '../storage-manager';
import { ICasaData } from './casa.types';

export const getCasaData = (): ICasaData | undefined => {
  const casaData = getItem(StorageKey.CasaData);
  const casaDashletId = new URLSearchParams(location.search)?.get('dashletId');
  if (casaData && casaDashletId) return casaData?.[casaDashletId] as ICasaData;
};

export const isCasaManageTaskTab = (): boolean => {
  const casaTaskAutoId = new URLSearchParams(location.search)?.get('taskAutoId');
  return !!(getCasaData() || casaTaskAutoId);
};
