import { ITabConfiguration } from 'common/types/entity/lead';
import { CallerSource } from 'common/utils/rest-client';

interface IAugmentedTabConfig {
  id: string;
  name: string;
  isOverflowing: boolean;
  width: number;
  type?: number;
}

interface ITab {
  id: string;
  name: string;
}

type IHandleManageTabs = (params: {
  tabConfiguration: ITabConfiguration[];
  activeTabId: string;
  callerSource: CallerSource;
  defaultTabId?: string;
}) => Promise<void>;
export type { IAugmentedTabConfig, ITab, IHandleManageTabs };
