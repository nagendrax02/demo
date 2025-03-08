import { useState, useEffect } from 'react';
import { trackError } from 'common/utils/experience';
import { TABS_CACHE_KEYS } from '../constants';
import {
  resetSmartViewsTabStore,
  setActiveTab,
  setTabData,
  useSmartViewTab
} from '../../smartview-tab/smartview-tab.store';
import useSmartViewStore, {
  resetSmartViewsStore,
  setRawTabData
} from 'apps/smart-views/smartviews-store';
import { Module, setMiPHeaderModule } from 'common/component-lib/mip-header';
import { ITabConfig } from '../../smartview-tab/smartview-tab.types';
import { endSVExpEvent, startSVExpEvent } from 'apps/smart-views/utils/utils';
import { SmartViewsEvents } from 'common/utils/experience/experience-modules';
import { getManageActivityData, getAugumentedActivities, getActivityCodeFromURL } from './utils';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import { getStandaloneSVAugmenter } from '..';
import { getCommonTabSetting } from '../utils';
import { IActivityCategoryMetadata } from 'apps/activity-history/types';
import { API_ROUTES } from 'common/constants';
import { EntityCode } from './constants';
import { CallerSource, httpGet, httpPost, Module as MODULE } from 'common/utils/rest-client';
import { StorageKey } from 'common/utils/storage-manager/storage.types';
import { HTTP_HEADERS } from 'common/utils/rest-client/constant';
import { useLocation } from 'wouter';

interface IUseManageActivityResult {
  categoryData: IActivityCategoryMetadata[];
  tabData: ReturnType<typeof useSmartViewTab>;
  tabId: string;
  selectedActivity: string;
  isLoading: boolean;
}

const getAugmentedData = async (tabData: ITabResponse): Promise<ITabConfig | undefined> => {
  const augmentedData = await (
    await getStandaloneSVAugmenter(tabData.Id)
  )?.augmentedTabData?.({
    tabData,
    allTabIds: [],
    commonTabSettings: getCommonTabSetting({ maxAllowedTabs: 0 })
  });
  return augmentedData;
};

const initializeData = async (selectedActivity: IActivityCategoryMetadata): Promise<void> => {
  try {
    startSVExpEvent(
      SmartViewsEvents.TabMetaDataFetchAndAugmentation,
      TABS_CACHE_KEYS.MANAGE_ACTIVITIES
    );

    const initialTabData = await getManageActivityData(selectedActivity);
    const augmentedData = await getAugmentedData(initialTabData);
    setActiveTab(TABS_CACHE_KEYS.MANAGE_ACTIVITIES);

    if (augmentedData) {
      // Considering Manage Activity as part of SV as it is available in left panel in standalone mode. So, adding rawTabData to SV Store
      setRawTabData(TABS_CACHE_KEYS.MANAGE_ACTIVITIES, initialTabData);
      setTabData(TABS_CACHE_KEYS.MANAGE_ACTIVITIES, augmentedData);
    }
  } catch (error) {
    trackError(error);
  }
  endSVExpEvent(
    SmartViewsEvents.TabMetaDataFetchAndAugmentation,
    TABS_CACHE_KEYS.MANAGE_ACTIVITIES
  );
};
const getLastSelectedActivity = async (
  activities: IActivityCategoryMetadata[]
): Promise<string> => {
  try {
    const response = await httpGet({
      path: `${API_ROUTES.cacheGet}${StorageKey.ManageActivityLastSelectedActivity}`,
      module: MODULE.Cache,
      callerSource: CallerSource.ManageActivities,
      requestConfig: { headers: { [HTTP_HEADERS.cacheControl]: 'no-cache' } }
    });
    return (
      activities.find((validactivity) => validactivity.Value === response)?.Value ||
      activities[0]?.Value
    );
  } catch (error) {
    trackError(error);
    return '';
  }
};

const setLastSelectedActivity = (eventCode: string): void => {
  httpPost({
    path: API_ROUTES.cachePost,
    module: MODULE.Cache,
    callerSource: CallerSource.ManageActivities,
    body: {
      key: StorageKey.ManageActivityLastSelectedActivity,
      Value: eventCode
    }
  });
};

const useManageActivity = (): IUseManageActivityResult => {
  const [activityCategoryData, setActivityCategoryData] = useState<IActivityCategoryMetadata[]>();
  const tabData = useSmartViewTab(TABS_CACHE_KEYS.MANAGE_ACTIVITIES);
  const { refresh, rawTabData } = useSmartViewStore();
  const eventCode = getActivityCodeFromURL();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentActivity = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const activities = await getAugumentedActivities();
        const currentSelectedActivity = activities.find((category) => category.Value === eventCode);

        if (!currentSelectedActivity) {
          const lastSelectedActivity = await getLastSelectedActivity(activities);
          setLocation(`${window.location.pathname}?${EntityCode}=${lastSelectedActivity}`);

          return;
        } else {
          setLastSelectedActivity(eventCode);
        }

        initializeData(currentSelectedActivity);
        setActivityCategoryData(activities);

        setMiPHeaderModule(Module.ManageActivities);
        setIsLoading(false);
      } catch (error) {
        trackError(error);
      }
    };
    fetchCurrentActivity();

    return () => {
      resetSmartViewsStore();
      resetSmartViewsTabStore();
    };
  }, [eventCode]);

  useEffect(() => {
    const fetchCachedData = async (): Promise<void> => {
      try {
        //useEffect to fetch data on refresh

        if (refresh) {
          const currentTabData = rawTabData[TABS_CACHE_KEYS.MANAGE_ACTIVITIES];
          const augmentedData = await getAugmentedData(currentTabData);
          if (augmentedData) {
            setTabData(TABS_CACHE_KEYS.MANAGE_ACTIVITIES, augmentedData);
          }
        }
      } catch (error) {
        trackError(error);
      }
    };
    fetchCachedData();
  }, [refresh]);

  return {
    categoryData: activityCategoryData ?? [],
    tabData: tabData,
    tabId: TABS_CACHE_KEYS.MANAGE_ACTIVITIES,
    selectedActivity: eventCode,
    isLoading
  };
};

export default useManageActivity;
