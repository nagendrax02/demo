import { getItem, StorageKey } from '../storage-manager';
import { getActiveAppTabId as getActiveAppTabIdV2 } from 'common/component-lib/app-tabs-v2';
import { getActiveAppTabId as getActiveAppTabIdV1 } from 'common/component-lib/app-tabs';
import { updateTabConfig as updateTabConfigV2, ITabConfig } from 'common/component-lib/app-tabs-v2';
import { updateTabConfig as updateTabConfigV1 } from 'src/common/component-lib/app-tabs-v2';

export const isAppHeaderEnabled = (): boolean => {
  return !!getItem(StorageKey.EnableAppHeader);
};

export const getActiveAppTabId = (): string => {
  if (isAppHeaderEnabled()) return getActiveAppTabIdV2();
  return getActiveAppTabIdV1();
};

export const updateTabConfig = (tabId: string, newConfig: Partial<ITabConfig>): void => {
  if (isAppHeaderEnabled()) {
    updateTabConfigV2(tabId, newConfig);
  } else {
    updateTabConfigV1(tabId, newConfig);
  }
};
