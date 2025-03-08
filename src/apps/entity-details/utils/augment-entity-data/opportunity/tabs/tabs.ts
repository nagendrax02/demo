import { ITabConfiguration } from 'common/types/entity/opportunity/detail.types';

const augmentTabConfig = (data: ITabConfiguration[]): ITabConfiguration[] => {
  return data.map((tab) => {
    tab.LastUpdatedOn = null;
    return tab;
  });
};

const getAugmentedTabData = (tabConfig: ITabConfiguration[]): ITabConfiguration[] => {
  if (!tabConfig || !tabConfig?.length) {
    return [];
  }

  return augmentTabConfig(tabConfig);
};

export { getAugmentedTabData };
