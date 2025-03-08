import { IGetIsFeatureRestriction } from '../../smartviews.types';
import { ITabConfig } from '../smartview-tab/smartview-tab.types';

interface IUseSmartViews {
  isLoading: boolean;
  activeTabId: string;
  tabData: ITabConfig;
  featureRestrictionRef?: React.MutableRefObject<IGetIsFeatureRestriction | null>;
}

export type { IUseSmartViews };
