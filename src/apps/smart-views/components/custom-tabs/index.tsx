import { ITabAugmenter } from 'apps/smart-views/augment-tab-data';
import { HeaderAction } from 'apps/smart-views/constants/constants';
import { TABS_CACHE_KEYS } from './constants';
import RelatedLeadsTab from './related-leads-tab';
import SalesActivityTab from './sales-activity-tab';

export const getStandaloneSVAugmenter = async (
  tabId: string
): Promise<ITabAugmenter | undefined> => {
  switch (tabId) {
    case TABS_CACHE_KEYS.LEAD_OPPORTUNITY_TAB: {
      const [augmentModule, tabSettingsModule] = await Promise.all([
        import('./lead-opportunity-tab/augment'),
        import('./lead-opportunity-tab/tab-settings')
      ]);
      return {
        augmentedTabData: augmentModule.default,
        getColumnConfig: augmentModule.getColumnConfig,
        augmentedTabSettingsData: {
          [HeaderAction.SelectColumns]:
            tabSettingsModule?.OpportunitySettingsAugmentHandler?.getColumnConfig,
          [HeaderAction.ManageFilters]:
            tabSettingsModule?.OpportunitySettingsAugmentHandler?.getFilterConfig
        }
      };
    }
    case TABS_CACHE_KEYS.MANAGE_LEADS_TAB: {
      const [augmentModule, tabSettingsModule] = await Promise.all([
        import('./manage-lead-tab/augment'),
        import('../../augment-tab-data/lead/tab-settings')
      ]);
      return {
        augmentedTabData: augmentModule.augmentedMangeLeadTabData,
        getColumnConfig: augmentModule.getColumnConfig,
        augmentedTabSettingsData: {
          [HeaderAction.SelectColumns]:
            tabSettingsModule?.tabSettingsAugmentHandler?.getColumnConfig,
          [HeaderAction.ManageFilters]:
            tabSettingsModule?.tabSettingsAugmentHandler?.getFilterConfig,
          [HeaderAction.ExportLeads]: tabSettingsModule?.tabSettingsAugmentHandler?.getColumnConfig
        }
      };
    }
    case TABS_CACHE_KEYS.MANAGE_TASKS_TAB: {
      const [augmentModule, tabSettingsModule] = await Promise.all([
        import('./manage-tasks/augmentation'),
        import('../../augment-tab-data/task/tab-settings')
      ]);
      return {
        augmentedTabData: augmentModule.default,
        getColumnConfig: augmentModule.getColumnConfig,
        augmentedTabSettingsData: {
          [HeaderAction.SelectColumns]:
            tabSettingsModule?.taskTabSettingsAugmentHandler?.getColumnConfig,
          [HeaderAction.ManageFilters]:
            tabSettingsModule?.taskTabSettingsAugmentHandler?.getFilterConfig,
          [HeaderAction.ExportLeads]:
            tabSettingsModule?.taskTabSettingsAugmentHandler?.getColumnConfig
        },
        getEntityCode: tabSettingsModule?.taskTabSettingsAugmentHandler?.getEntityCode
      };
    }
    case TABS_CACHE_KEYS.MANAGE_ACTIVITIES: {
      const [augmentModule, tabSettingsModule] = await Promise.all([
        import('./manage-activity-tab/augumentation'),
        import('../../augment-tab-data/activity/tab-settings')
      ]);
      return {
        augmentedTabData: augmentModule.default,
        getColumnConfig: augmentModule.getColumnConfig,
        augmentedTabSettingsData: {
          [HeaderAction.SelectColumns]:
            tabSettingsModule?.ActivitySettingsAugmentHandler?.getColumnConfig,
          [HeaderAction.ManageFilters]:
            tabSettingsModule?.ActivitySettingsAugmentHandler?.getFilterConfig,
          [HeaderAction.ExportLeads]:
            tabSettingsModule?.ActivitySettingsAugmentHandler?.getColumnConfig
        }
      };
    }
    case TABS_CACHE_KEYS.MANAGE_LISTS_TAB: {
      const augmentModule = await import('./manage-lists/augment');
      return {
        augmentedTabData: augmentModule.default,
        getColumnConfig: augmentModule.getColumnConfig,
        augmentedTabSettingsData: {}
      };
    }
  }
};

export { RelatedLeadsTab, SalesActivityTab };
