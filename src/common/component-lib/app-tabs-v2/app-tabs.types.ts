export enum TabIconType {
  Lead = 'lead',
  Opportunity = 'opportunity',
  Account = 'account',
  Custom = 'custom'
}

export interface ITabConfig {
  // TO DO: currently id => path + entityId, but need to change this to id => path + queryParam
  id: string;
  title: string;
  url: string;
  isActiveTab: boolean;
  iconType: TabIconType;
  customIconName?: string;
  customTooltipMessage?: string;
  customStyleClass?: string;
  showErrorState?: boolean;
}

export interface IAppTabsStore {
  isAppTabsEnabled: boolean;
  appTabsConfig: ITabConfig[];
  moreTabList?: string[];
}
