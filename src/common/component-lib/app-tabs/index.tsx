import AppTabs from './AppTabs';
import { updateTabConfig } from './app-tabs.store';
import { ITabConfig } from './app-tabs.types';
import { getActiveAppTabId } from './utils/hook-utils';

export default AppTabs;
export { updateTabConfig, getActiveAppTabId };
export type { ITabConfig };
