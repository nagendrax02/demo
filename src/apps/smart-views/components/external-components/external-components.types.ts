import { CreateListMode, IEditListConfig, ITabResponse } from '../../smartviews.types';
import { TabMode } from './constants';
import { IQuickFilterResponse } from '../smartview-tab/components/header/search-filter/quick-filter/quick-filter.types';

export interface IConfigureTabPayload {
  show: boolean;
  mode: TabMode;
  header: string;
  finalNextButtonText: string;
  smartviewId: string;
  tabDetails?: ITabResponse;
  isCustomTabTypeEnabled?: boolean;
  isDesktopView: boolean;
  LeadQuickSelectedFilter?: IQuickFilterResponse;
  isLeadTypeEnabled?: boolean;
  leadTypeInternalName?: string;
  createMode?: CreateListMode;
  editListConfig?: IEditListConfig;
}

export interface IConfigureTabHelper {
  smartviewId: string;
  mode: TabMode;
  isCustomTabTypeEnabled: boolean;
  tabDetails?: ITabResponse;
  LeadQuickSelectedFilter?: IQuickFilterResponse;
  isLeadTypeEnabled?: boolean;
  leadTypeInternalName?: string;
  createMode?: CreateListMode;
  editListConfig?: IEditListConfig;
}
export interface IQuickFilter {
  quickFilterId: string;
  quickFilterName: string;
  quickFilterValue: string;
}

export interface ISaveTabMessage {
  type: string;
  message: {
    isSuccessful: false;
    tabData?: ITabResponse;
    leadQuickFilter?: IQuickFilter;
    listName?: string;
  };
}
