import { ITabConfiguration } from 'common/types/entity/lead';
import { IAccountDetails } from 'common/types/entity';
import { TAB_ID } from 'src/common/component-lib/entity-tabs/constants/tab-id';

const augmentTabConfig = (
  data: ITabConfiguration[],
  entityDetails: IAccountDetails
): ITabConfiguration[] => {
  return data
    .map((tab) => {
      tab.LastUpdatedOn = null;
      if (tab?.Id === 'accountDetails' && tab?.TabConfiguration?.Title) {
        tab.TabConfiguration.Title = `${entityDetails.AccountTypeName} Details`;
      }
      return tab;
    })
    ?.filter((tab) => !(tab.Id == TAB_ID.Notes || tab?.Id === TAB_ID.Documents));
};

const getAugmentedTabData = (
  tabConfig: ITabConfiguration[],
  entityDetails: IAccountDetails
): ITabConfiguration[] => {
  if (!tabConfig || !tabConfig?.length) {
    return [];
  }

  return augmentTabConfig(tabConfig, entityDetails);
};

export { getAugmentedTabData };
