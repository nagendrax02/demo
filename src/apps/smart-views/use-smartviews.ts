import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-depth */
/* eslint-disable max-lines-per-function */
import { useEffect, useRef } from 'react';
import { handleAugmentation } from './utils/augment';
import useSmartViewStore, {
  resetSmartViewsStore,
  setIsLoading,
  setSmartViewData
} from './smartviews-store';
import {
  endSVExpEvent,
  endSVLoadExperience,
  getTabMetaData,
  isCustomTypeTab,
  startSVExpEvent
} from './utils/utils';
import getEntityDataManager from 'common/utils/entity-data-manager';
import { EntityType } from 'common/types';
import { CallerSource } from 'common/utils/rest-client';
import getSVAugmenter from './augment-tab-data';
import {
  ICommonTabSettings,
  IGetIsFeatureRestriction,
  IPanel,
  ITabResponse
} from './smartviews.types';
import {
  resetSmartViewsTabStore,
  setActiveTab,
  setTabData,
  useSmartViewTab
} from './components/smartview-tab/smartview-tab.store';
import { ITabConfig } from './components/smartview-tab/smartview-tab.types';
import { getPermissionTemplate } from 'common/utils/permission-manager/permission-normalization';
import { getSettingConfig, isOpportunityEnabled, settingKeys } from 'common/utils/helpers';
import { getIsAccountEnabled, getIsFullScreenEnabled } from 'common/utils/helpers/settings-enabled';
import { Module, setMiPHeaderModule } from 'common/component-lib/mip-header';
import useEntityDetailStore from '../entity-details/entitydetail.store';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { SmartViewsEvents } from 'common/utils/experience/experience-modules';
import { getStandaloneSVAugmenter } from './components/custom-tabs';
import useFeatureRestrictionStore from 'common/utils/feature-restriction/use-feature-restriction-store';
import { getIsFeatureRestriction } from './utils/feature-restriction';
import { isLeadTypeEnabled as getIsLeadTypeEnabled } from 'common/utils/lead-type/settings';
import { fetchActionPanelSetting } from './utils/entity-action-restriction/utils/fetch-data';
import { getFromDB, StorageKey } from 'common/utils/storage-manager';

interface IUseSmartViews {
  isLoading: boolean;
  activeTabId: string;
  tabData: ITabConfig;
  panel: IPanel | null;
  primaryColor: string;
  featureRestrictionRef: React.MutableRefObject<IGetIsFeatureRestriction | null>;
  rawTabData: Record<string, ITabResponse>;
}

const useSmartViews = (): IUseSmartViews => {
  const { isLoading, activeTabId, rawTabData, allTabIds, commonTabSettings, panel, refresh } =
    useSmartViewStore();
  const tabData = useSmartViewTab(activeTabId);
  const primaryColor = rawTabData?.[activeTabId]?.TabConfiguration?.PrimaryColor;
  const { setRepresentationName } = useEntityDetailStore((state) => ({
    setRepresentationName: state.setRepresentationName
  }));
  const { restrictionData } = useFeatureRestrictionStore();
  const featureRestrictionRef = useRef<IGetIsFeatureRestriction | null>(null);

  useEffect(() => {
    let outerError: unknown = undefined;
    (async (): Promise<void> => {
      startSVExpEvent(SmartViewsEvents.TabMetaDataFetchAndAugmentation, '');

      setIsLoading(true);
      try {
        setMiPHeaderModule(Module.SmartViews);
        const fetchLeadRepresentationName = (await getEntityDataManager(EntityType.Lead))
          ?.fetchRepresentationName;
        const [
          tabMetaData,
          leadRepresentationName,
          featureRestriction,
          isLeadTypeEnabledForSV,
          isLeadTypeEnabledGlobally,
          cachedActiveTabId
        ] = await Promise.all([
          getTabMetaData(),
          fetchLeadRepresentationName?.(CallerSource.SmartViews, ''),
          getIsFeatureRestriction(restrictionData),
          getIsLeadTypeEnabled(CallerSource.SmartViews),
          getIsLeadTypeEnabled(CallerSource.SmartViews, true),
          getFromDB<string>(StorageKey.SmartViewsActiveTabId),
          fetchActionPanelSetting(CallerSource.SmartViews),
          getPermissionTemplate(CallerSource.SmartViews),
          isOpportunityEnabled(CallerSource.SmartViews),
          getIsAccountEnabled(CallerSource.SmartViews),
          getIsFullScreenEnabled(CallerSource.SmartViews),
          getSettingConfig(settingKeys.EnableESSForLeadManagement, CallerSource.SmartViews)
        ]);
        featureRestrictionRef.current = featureRestriction;

        // setting Lead Rep Name in entity Details Store since it is being used in MipHeader.
        setRepresentationName({
          ...DEFAULT_ENTITY_REP_NAMES,
          lead: leadRepresentationName ?? DEFAULT_ENTITY_REP_NAMES.lead
        });

        const augmentedData = handleAugmentation({
          data: tabMetaData,
          leadRepresentationName,
          isLeadTypeEnabled: isLeadTypeEnabledForSV,
          isLeadTypeEnabledGlobally: isLeadTypeEnabledGlobally
        });

        if (cachedActiveTabId) augmentedData.activeTabId = cachedActiveTabId;

        setSmartViewData(augmentedData);

        endSVExpEvent(SmartViewsEvents.TabMetaDataFetchAndAugmentation, '');
      } catch (error) {
        trackError(error);
        outerError = Object.assign(error, { expandedErrorMessage: 'SV augmentation' }) as Error;
        endSVExpEvent(SmartViewsEvents.TabMetaDataFetchAndAugmentation, '', true);
        endSVLoadExperience({ tabId: '', fetchCriteria: {}, recordCount: 0, tabType: 'unknown' });
      }
      setIsLoading(false);
    })();

    if (outerError instanceof Error) {
      throw outerError;
    }

    return () => {
      resetSmartViewsStore();
      resetSmartViewsTabStore();
    };
  }, []);

  const getAugmentedData = async (currentTabData: ITabResponse): Promise<ITabConfig | null> => {
    if (isCustomTypeTab(currentTabData)) {
      return null;
    }
    const augmentedData = await (
      (await getStandaloneSVAugmenter(currentTabData.Id)) ??
      (await getSVAugmenter(currentTabData.Type))
    )?.augmentedTabData?.({
      tabData: currentTabData,
      allTabIds,
      commonTabSettings: commonTabSettings as ICommonTabSettings
    });

    return augmentedData;
  };

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (activeTabId) {
          startSVExpEvent(SmartViewsEvents.ActiveTabDataAugmentation, activeTabId);

          setActiveTab(activeTabId);
          const currentTabData = rawTabData[activeTabId];
          if (tabData?.id === activeTabId) {
            setTabData(activeTabId, tabData);
          } else {
            const augmentedData = await getAugmentedData(currentTabData);
            if (augmentedData) setTabData(activeTabId, augmentedData);
          }

          endSVExpEvent(SmartViewsEvents.ActiveTabDataAugmentation, activeTabId);
        }
      } catch (error) {
        trackError(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);

  useEffect(() => {
    const setReAugmentedData = async (): Promise<void> => {
      try {
        if (refresh && activeTabId) {
          const currentTabData = rawTabData[activeTabId];
          const augmentedData = await getAugmentedData(currentTabData);
          if (augmentedData) setTabData(activeTabId, augmentedData);
        }
      } catch (error) {
        trackError(error);
      }
    };

    setReAugmentedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return {
    isLoading,
    tabData,
    activeTabId,
    panel,
    primaryColor,
    featureRestrictionRef,
    rawTabData
  };
};

export default useSmartViews;
