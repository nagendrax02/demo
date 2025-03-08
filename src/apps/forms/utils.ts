import { IProcessResponse } from 'common/utils/process/process.types';
import { reinitiateFetchLead } from '../entity-details/entitydetail.store';
import {
  getAllAugmentedTabs,
  updateTab
} from 'common/component-lib/entity-tabs/store/entitytabs.store';
import { trackError } from 'common/utils/experience';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import { ENV_CONFIG } from 'common/constants';

interface IIsDefaultForm {
  shouldContainDefaultForm?: boolean;
  workAreaProcessDetails: IProcessResponse;
}

interface IIsDefaultFormConfig {
  isDefaultForm: boolean;
  isNoForm: boolean;
}

export const isDefaultForm = ({
  shouldContainDefaultForm,
  workAreaProcessDetails
}: IIsDefaultForm): IIsDefaultFormConfig => {
  if (!workAreaProcessDetails?.ActionOutputs?.length) {
    return {
      isDefaultForm: true,
      isNoForm: !shouldContainDefaultForm
    };
  }
  if (
    workAreaProcessDetails &&
    workAreaProcessDetails.ActionOutputs &&
    !workAreaProcessDetails.ActionOutputs.length
  ) {
    if (!shouldContainDefaultForm) {
      return {
        isDefaultForm: false,
        isNoForm: true
      };
    } else {
      return {
        isDefaultForm: true,
        isNoForm: false
      };
    }
  } else {
    return {
      isDefaultForm: false,
      isNoForm: false
    };
  }
};

export function generateMapForTabsToUpdate(): void {
  const tabIdToShouldUpdateTabmap = {
    leadApp: true,
    leadActivityHistory: true,
    tasksAndNotes: true,
    leadOverview: true,
    leadDetails: true,
    leadOpportunities: true,
    LeadAuditLogs: true,
    LeadNotes: true,
    leaddocumentsSummary: true,
    RelatedLeads: true,
    ActivityHistory: true
  };
  const allTabs = getAllAugmentedTabs();
  allTabs?.forEach?.((tabData) => {
    if (tabData?.type === 2 || tabData?.type === 3) {
      tabIdToShouldUpdateTabmap[tabData.id] = true;
    }
  });

  if (typeof window === 'object') {
    window.tabsToUpdate = tabIdToShouldUpdateTabmap;
  }
  // added is used here to update the current tab
  updateTab();
}

interface IShouldRefreshTab {
  tabId: string;
}
export function shouldRefreshTab({ tabId }: IShouldRefreshTab): boolean {
  if (!window?.tabsToUpdate) return false;
  const isRefreshTab = window.tabsToUpdate[tabId] as boolean;
  return isRefreshTab ? true : false;
}

export function updateMapForTabsToUpdate(tabId: string): void {
  if (!window?.tabsToUpdate) return;
  window.tabsToUpdate[tabId] = false;
}

export const updateLeadStore = (): void => {
  setTimeout(() => {
    reinitiateFetchLead();
  }, 1000);
};

export const updateLeadAndLeadTabs = (doNotUpdateLeadStore?: boolean): void => {
  setTimeout(() => {
    if (!doNotUpdateLeadStore) updateLeadStore();
    generateMapForTabsToUpdate();
  }, 1000);
};

export function sendPostMessage<T>(
  iframeRef: HTMLIFrameElement | null | undefined,
  message: T,
  targetOrigins: string[] = ['*']
): void {
  if (iframeRef?.contentWindow) {
    const iframeSrc = iframeRef.src;
    try {
      const iframeOrigin = new URL(iframeSrc).origin;
      if (targetOrigins.includes(iframeOrigin) || targetOrigins.includes('*')) {
        iframeRef.contentWindow.postMessage(message, iframeOrigin);
      } else {
        trackError(new Error(`IFrame origin ${iframeOrigin} does not match any target origins.`));
      }
    } catch (error) {
      trackError(error);
    }
  } else {
    trackError(new Error('IFrame or its contentWindow is not available.'));
  }
}

export const getFormsRenderUrl = (): string => {
  if (getItem<number>(StorageKey.EnableFormsCloneUrl) === 1) {
    return new URL(self?.[ENV_CONFIG.envKey]?.[ENV_CONFIG.formsCloneRenderURL])?.origin;
  }
  return new URL(self?.[ENV_CONFIG.envKey]?.[ENV_CONFIG.formsRenderURL])?.origin;
};
