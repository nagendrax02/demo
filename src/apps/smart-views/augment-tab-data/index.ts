import { HeaderAction, TabType } from '../constants/constants';
import { ICommonTabSettings, ITabResponse } from '../smartviews.types';
import { ITabConfig } from '../components/smartview-tab/smartview-tab.types';
import {
  IAugmentedTabSettingsDataMethod,
  IColumnConfig,
  IGetColumnConfig
} from './common-utilities/common.types';

export interface ITabAugmenter {
  augmentedTabData: (config: {
    tabData: ITabResponse;
    allTabIds: string[];
    commonTabSettings: ICommonTabSettings;
  }) => Promise<ITabConfig>;
  getColumnConfig: (config: IGetColumnConfig) => Promise<IColumnConfig>;
  augmentedTabSettingsData: {
    [x: string]: IAugmentedTabSettingsDataMethod;
  };
  getEntityCode?: (tabId: string, selectedTabType: string) => string;
}

// eslint-disable-next-line max-lines-per-function
export const getSVAugmenter = async (tabType: TabType): Promise<ITabAugmenter> => {
  switch (tabType) {
    case TabType.AccountActivity: {
      const [augmentModule, tabSettingsModule] = await Promise.all([
        import('./account-activity'),
        import('./account-activity/tab-settings')
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

    case TabType.Activity: {
      const [augmentModule, tabSettingsModule] = await Promise.all([
        import('./activity'),
        import('./activity/tab-settings')
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
    case TabType.Account: {
      const [augmentModule, tabSettingsModule] = await Promise.all([
        import('./account'),
        import('./account/tab-settings')
      ]);
      return {
        augmentedTabData: augmentModule.default,
        getColumnConfig: augmentModule.getColumnConfig,
        augmentedTabSettingsData: {
          [HeaderAction.SelectColumns]:
            tabSettingsModule?.AccountSettingsAugmentHandler?.getColumnConfig,
          [HeaderAction.ManageFilters]:
            tabSettingsModule?.AccountSettingsAugmentHandler?.getFilterConfig,
          [HeaderAction.ExportLeads]:
            tabSettingsModule?.AccountSettingsAugmentHandler?.getColumnConfig
        }
      };
    }
    case TabType.Opportunity: {
      const [augmentModule, tabSettingsModule] = await Promise.all([
        import('./opportunity'),
        import('./opportunity/tab-settings')
      ]);
      return {
        augmentedTabData: augmentModule.default,
        getColumnConfig: augmentModule.getColumnConfig,
        augmentedTabSettingsData: {
          [HeaderAction.SelectColumns]:
            tabSettingsModule?.OpportunitySettingsAugmentHandler?.getColumnConfig,
          [HeaderAction.ManageFilters]:
            tabSettingsModule?.OpportunitySettingsAugmentHandler?.getFilterConfig,
          [HeaderAction.ExportLeads]:
            tabSettingsModule?.OpportunitySettingsAugmentHandler?.getColumnConfig
        }
      };
    }
    case TabType.Task: {
      const [augmentModule, tabSettingsModule] = await Promise.all([
        import('./task'),
        import('./task/tab-settings')
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
        }
      };
    }
    case TabType.Lead:
    default: {
      const [augmentModule, tabSettingsModule] = await Promise.all([
        import('./lead'),
        import('./lead/tab-settings')
      ]);
      return {
        augmentedTabData: augmentModule.default,
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
  }
};

export default getSVAugmenter;
