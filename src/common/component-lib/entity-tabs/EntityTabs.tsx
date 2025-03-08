import styles from './entitytabs.module.css';
import useEntityTabsStore from './store';
import { swapActiveTabWithLastVisibleTab } from './utils/swap-tabs';
import { getOverflowingAndNonOverflowingTabs } from './utils/overflow';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getActiveTabKey,
  getNormalizedConfig,
  handleLeadLoadExperience,
  updateTabOnFormSubmit,
  getOpportunityRepName
} from './utils/general';
import TabShimmer from './tab-shimmer';
import { Tabs } from '../tabs';
import TabItems from './tab-items';
import TabContent from './tab-content';
import TabActions from './tab-actions';
import { ITabConfiguration } from 'common/types/entity/lead';
import { useNotificationStore } from '@lsq/nextgen-preact/notification';
import { ITabsConfig } from 'apps/entity-details/types';
import useEntityDetailStore, { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import {
  getExperienceKey,
  startExperienceEvent,
  endExperienceEvent,
  EntityDetailsEvents,
  ExperienceType
} from 'common/utils/experience';
import { IEntityDetailsCoreData } from '../../../apps/entity-details/types/entity-data.types';
import { EntityType } from 'common/types';
import { useTabRecordCounter } from '../tab-record-counter';
import { IHandleManageTabs } from './types/entitytabs.types';
import { updateActiveTabIdInUrl } from 'common/utils/helpers/helpers';
import { IGetExperienceKey } from 'common/utils/experience/experience.types';

interface IEntityTabs {
  config: ITabConfiguration[] | undefined;
  isLoading: boolean;
  coreData: IEntityDetailsCoreData;
  customClassName?: string;
  isUpdating?: boolean;
}

const startExperience = (
  renderingStarted: React.MutableRefObject<boolean>,
  experienceConfig: IGetExperienceKey
): void => {
  renderingStarted.current = true;
  startExperienceEvent({
    module: experienceConfig?.module,
    experience: ExperienceType.Load,
    event: EntityDetailsEvents.TabsRender,
    key: experienceConfig.key
  });
};

const EntityTabs = (props: IEntityTabs): JSX.Element => {
  const { config, isLoading, coreData, customClassName, isUpdating } = props;
  const experienceConfig = getExperienceKey();
  const renderingStarted = useRef(false);

  useMemo(() => {
    if (isUpdating) {
      startExperience(renderingStarted, experienceConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdating]);

  const { eventCode, entityRepNames, entityIds, entityDetailsType } = coreData;
  const { initializeTabRecordCount } = useTabRecordCounter();

  const eventCodeString = eventCode ? `${eventCode}` : undefined;
  const activeTabKey = useEntityTabsStore((state) => state?.activeTabKey);
  const refreshConfig = useEntityTabsStore((state) => state?.refreshConfig);
  const setActiveTabKey = useEntityTabsStore((state) => state?.setActiveTabKey);
  const augmentedTabs = useEntityTabsStore((state) => state?.augmentedTabs);
  const setAugmentedTabs = useEntityTabsStore((state) => state?.setAugmentedTabs);
  const setTabConfig = useEntityTabsStore((state) => state?.setTabConfig);
  const leadRepName = useLeadRepName();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [mountedTabs, setMountedTabs] = useState<string[]>([]);
  const setNotification = useNotificationStore((state) => state.setNotification);
  const [normalizedTabCOnfig, setNormalizedTabConfig] = useState<ITabsConfig[]>();
  const entityType = useEntityDetailStore((state) => state?.entityType);

  useEffect(() => {
    if (activeTabKey) setMountedTabs([...new Set([...mountedTabs, activeTabKey])]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabKey]);

  useEffect(() => {
    updateTabOnFormSubmit({ tabId: activeTabKey });
  }, [activeTabKey]);

  const handleActiveTabKey = (tabKey: string): void => {
    setActiveTabKey(tabKey);
    updateActiveTabIdInUrl(tabKey);
  };

  const handleTabAugmentation = (normalizedConfig: ITabsConfig[], activeTabId: string): void => {
    const tabContainerWidth = tabsRef?.current?.getBoundingClientRect()?.width || 1;

    const validTabIds = normalizedConfig?.map((tabConfig) => tabConfig?.id);

    if (!activeTabKey || (activeTabId && !validTabIds.includes(activeTabKey))) {
      setActiveTabKey(activeTabId);
    }
    setAugmentedTabs(
      swapActiveTabWithLastVisibleTab(
        getOverflowingAndNonOverflowingTabs(tabContainerWidth, normalizedConfig),
        activeTabId
      ) || []
    );
  };

  useEffect(() => {
    (async (): Promise<void> => {
      let oppRepName = entityRepNames?.opportunity;
      if (!oppRepName || entityType == EntityType.Lead) oppRepName = await getOpportunityRepName();

      const tabsConfig = getNormalizedConfig({
        configToBeNormalized: config,
        leadRepName,
        oppRepName,
        entityDetailsType: coreData.entityDetailsType
      });
      setNormalizedTabConfig(tabsConfig);
      handleTabAugmentation(
        tabsConfig,
        activeTabKey || getActiveTabKey(entityDetailsType, tabsConfig)
      );
      setTabConfig(config);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    if (entityIds?.lead) initializeTabRecordCount(entityIds?.lead);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityIds.lead]);

  const handleManageTab: IHandleManageTabs = async ({
    activeTabId,
    defaultTabId,
    callerSource,
    tabConfiguration
  }): Promise<void> => {
    const module = await import('./utils/manageTab');
    await module.handleManageTab({
      tabConfiguration,
      activeTabId,
      defaultTabId: defaultTabId || '',
      handleTabAugmentation,
      setActiveTabKey,
      setNormalizedTabConfig,
      setNotification,
      setTabConfig,
      callerSource,
      leadRepName,
      oppRepName: entityRepNames?.opportunity,
      entityType,
      eventCode: eventCodeString
    });
  };

  useEffect(() => {
    if (!isUpdating && activeTabKey && renderingStarted.current) {
      renderingStarted.current = false;
      endExperienceEvent({
        module: experienceConfig?.module,
        experience: ExperienceType.Load,
        event: EntityDetailsEvents.TabsRender,
        key: experienceConfig.key
      });
      handleLeadLoadExperience(activeTabKey, entityType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdating, activeTabKey]);

  return (
    <div className={`${styles.entity_tabs} ${customClassName}`} data-testid="entity-tabs">
      <div className={styles.tabs_container}>
        <Tabs tabsRef={tabsRef} customStyleClass={styles.tabs}>
          {isLoading ? (
            <TabShimmer />
          ) : (
            <TabItems
              data={augmentedTabs}
              onTabClick={handleActiveTabKey}
              activeTabKey={activeTabKey}
            />
          )}
        </Tabs>

        <TabActions isLoading={isLoading} handleManageTab={handleManageTab} coreData={coreData} />
      </div>
      <>
        {mountedTabs?.map((tabKey) => (
          <>
            <TabContent
              tabKey={tabKey}
              isActive={tabKey === activeTabKey}
              config={normalizedTabCOnfig}
              refreshConfig={refreshConfig}
              coreData={coreData}
            />
          </>
        ))}
      </>
    </div>
  );
};

EntityTabs.defaultProps = {
  isUpdating: undefined
};

export default EntityTabs;
