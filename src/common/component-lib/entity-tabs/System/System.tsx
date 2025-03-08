import { ITabsConfig } from 'apps/entity-details/types';
import { systemTabConfig } from './system-tab-config';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

interface ISystem {
  tab: ITabsConfig | undefined;
  coreData: IEntityDetailsCoreData;
}

const System = ({ tab, coreData }: ISystem): JSX.Element => {
  if (tab?.id && systemTabConfig?.[tab?.id]) {
    return systemTabConfig[tab?.id]({ ...coreData, tabId: tab.id });
  }
  return <>{tab?.name}</>;
};

export default System;
