import { trackError } from 'common/utils/experience/utils/track-error';
import { ITabsConfig } from 'apps/entity-details/types';
import { ITabConfiguration } from 'common/types/entity/lead';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { TAB_ID } from '../constants/tab-id';
import { IEntityRepresentationName, TabType } from 'apps/entity-details/types/entity-data.types';
import { shouldRefreshTab } from 'apps/forms/utils';
import { updateTab } from '../store/entitytabs.store';
import { endEntityDetailsLoadExperience } from 'common/utils/experience/utils/module-utils';
import { EntityType } from 'common/types';
import { CallerSource } from 'src/common/utils/rest-client';
import { getActiveTabIdFromUrl } from 'common/utils/helpers/helpers';

const getTabName = (name: string): string => {
  if (name && name?.length > 20) {
    return `${name?.substring(0, 17)}...`;
  }
  return name;
};

const handleLeadLoadExperience = (activeTabId: string, entityTpe: EntityType): void => {
  try {
    if (!activeTabId) return;
    const activityHistoryTabId = {
      [EntityType.Lead]: 'leadActivityHistory',
      [EntityType.Account]: 'accountActivityHistory',
      [EntityType.Opportunity]: 'ActivityHistory'
    };
    if (activeTabId !== activityHistoryTabId[entityTpe]) {
      endEntityDetailsLoadExperience();
    }
  } catch (error) {
    trackError(error);
  }
};

const getValidActiveTabKey = ({
  tabs,
  activeTabFromUrl,
  activeTabId
}: {
  tabs: ITabsConfig[];
  activeTabFromUrl?: string;
  activeTabId?: string;
}): string => {
  return activeTabFromUrl ?? activeTabId ?? tabs?.[0]?.id;
};

const getValidOppActiveTabKey = ({
  tabs,
  validTabIds,
  activeTabFromUrl,
  activeTabId
}: {
  tabs: ITabsConfig[];
  validTabIds: string[];
  activeTabFromUrl?: string;
  activeTabId?: string;
}): string => {
  if (validTabIds?.includes(TAB_ID.ActivityHistory)) {
    return activeTabFromUrl ?? activeTabId ?? TAB_ID.ActivityHistory;
  }
  return getValidActiveTabKey({ tabs, activeTabFromUrl, activeTabId });
};

const getActiveTabKey = (entityType: EntityType, tabs: ITabsConfig[] | undefined): string => {
  if (!tabs || !tabs?.length) {
    return '';
  }

  //Added this to test in local and when default tab is not working due to API issues
  const isAhDefault = getItem(StorageKey.ActivityHistoryDefault) || false;
  if (isAhDefault) {
    return TAB_ID.LeadActivityHistory;
  }

  const activeTabId = tabs?.find((tab) => tab?.isDefault)?.id as string;

  const validTabIds = tabs?.map((tab) => tab?.id);

  const activeTabFromUrl = getActiveTabIdFromUrl(validTabIds);

  if (entityType === EntityType.Opportunity) {
    return getValidOppActiveTabKey({ tabs, validTabIds, activeTabFromUrl, activeTabId });
  }

  return getValidActiveTabKey({ tabs, activeTabFromUrl, activeTabId });
};

const TABS_TO_SHOW = {
  [TAB_ID.LeadActivityHistory]: 1,
  [TAB_ID.LeadAttributeDetails]: 1,
  [TAB_ID.LeadNotes]: 1,
  [TAB_ID.LeadTasks]: 1,
  [TAB_ID.LeadDocuments]: 1,
  [TAB_ID.LeadShareHistory]: 1,
  [TAB_ID.ActivityDetails]: 1,
  [TAB_ID.ActivityHistory]: 1,
  [TAB_ID.Documents]: 1,
  [TAB_ID.RelatedLeads]: 1,
  [TAB_ID.Notes]: 1,
  [TAB_ID.Tasks]: 1,
  [TAB_ID.OpportunityShareHistory]: 1,
  [TAB_ID.LeadShareHistory]: 1,
  [TAB_ID.AccountDetails]: 1,
  [TAB_ID.AccountActivityHistory]: 1,
  [TAB_ID.Leads]: 1,
  [TAB_ID.SalesActivityDetails]: 1,
  [TAB_ID.LeadOpportunities]: 1,
  [TAB_ID.LeadEntityAuditLogs]: 1
};

const canShowTab = (tabType: TabType, tabId: string): boolean => {
  return !!(
    tabType === TabType.CustomActivity ||
    tabType === TabType.CustomTab ||
    tabType === TabType.Connector ||
    TABS_TO_SHOW[tabId]
  );
};

const getEntityTabName = ({
  tabName,
  leadRepName,
  oppRepName,
  tabType,
  entityDetailsType
}: {
  tabName: string;
  leadRepName?: IEntityRepresentationName;
  oppRepName?: IEntityRepresentationName;
  tabType: number;
  entityDetailsType: EntityType;
}): string => {
  try {
    let augmentedName = tabName;

    if (leadRepName && tabType === TabType.System && entityDetailsType !== EntityType.Opportunity) {
      augmentedName = augmentedName.replaceAll('Lead', leadRepName.SingularName);
    }

    if (oppRepName && tabType === TabType.System) {
      augmentedName = augmentedName.replaceAll('Opportunity', oppRepName.SingularName);
    }

    return augmentedName;
  } catch (error) {
    trackError(error);
    return tabName;
  }
};

const getNormalizedConfig = ({
  configToBeNormalized,
  leadRepName,
  oppRepName,
  entityDetailsType
}: {
  configToBeNormalized?: ITabConfiguration[];
  leadRepName?: IEntityRepresentationName;
  oppRepName?: IEntityRepresentationName;
  entityDetailsType: EntityType;
}): ITabsConfig[] => {
  return (
    configToBeNormalized?.map((tab) => {
      // let tabName = tab?.TabContentConfiguration?.Title ?? '';
      let tabName = tab?.TabConfiguration?.Title ?? '';

      if (tab?.Id == 'leadOpportunities') tabName = oppRepName?.PluralName ?? 'Opportunities';
      else
        tabName = getEntityTabName({
          tabName,
          leadRepName,
          oppRepName,
          tabType: tab.Type,
          entityDetailsType
        });

      return {
        id: tab?.Id,
        name: tabName,
        isDefault: tab?.TabConfiguration?.IsDefault,
        type: tab?.Type,
        url: tab?.TabContentConfiguration?.URL,
        activities: tab?.TabContentConfiguration?.Activities
      };
    }) || []
  ).filter((tab) => {
    return canShowTab(tab.type, tab.id);
  });
};

const isActivityHistoryTabPresent = (tabConfiguration: ITabConfiguration[]): boolean => {
  return (
    tabConfiguration?.some((tab) => tab?.Id === 'leadActivityHistory') ||
    tabConfiguration?.some((tab) => tab?.Id === TAB_ID.ActivityHistory) ||
    false
  );
};

const getOpportunityRepName = async (): Promise<IEntityRepresentationName> => {
  try {
    const oppRename = await (
      await import('common/utils/helpers')
    ).getOpportunityRepresentationName(CallerSource.LeadDetails);
    return {
      SingularName: oppRename.OpportunityRepresentationSingularName,
      PluralName: oppRename.OpportunityRepresentationPluralName
    } as IEntityRepresentationName;
  } catch (error) {
    trackError(error);
    return {
      SingularName: 'Opportunity',
      PluralName: 'Opportunities'
    } as IEntityRepresentationName;
  }
};

interface IUpdateTabOnFormSubmit {
  tabId: string;
}
const updateTabOnFormSubmit = ({ tabId }: IUpdateTabOnFormSubmit): void => {
  const isTabToBeRefreshed = shouldRefreshTab({ tabId });
  if (isTabToBeRefreshed) {
    updateTab(tabId);
  }
};
export {
  getTabName,
  getActiveTabKey,
  getNormalizedConfig,
  isActivityHistoryTabPresent,
  updateTabOnFormSubmit,
  canShowTab,
  handleLeadLoadExperience,
  getEntityTabName,
  getOpportunityRepName
};
