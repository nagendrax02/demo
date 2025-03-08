/* eslint-disable max-lines-per-function */
import { ITabConfiguration } from 'common/types/entity/lead';
import { updateEntityTabConfiguration } from 'common/utils/entity-data-manager/lead/cache-details';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { getNormalizedConfig } from './general';
import { EntityType } from 'common/types';
import { getAccountTypeId, getOpportunityEventCode } from 'common/utils/helpers/helpers';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getLeadType } from 'apps/entity-details/entitydetail.store';

const route = {
  [EntityType.Lead]: '/Lead/SaveTabConfiguration',
  [EntityType.Account]: '/Account/SaveTabConfiguration',
  [EntityType.Opportunity]: '/Opportunity/SaveTabConfiguration'
};

const getRoute = (entityType: EntityType): string => {
  if (entityType === EntityType.Account) {
    return `${route[EntityType.Account]}?accountTypeId=${getAccountTypeId()}`;
  } else if (entityType === EntityType.Opportunity) {
    return `${route[EntityType.Opportunity]}?eventType=${getOpportunityEventCode() || -1}`;
  }
  const leadType = getLeadType();
  return leadType ? `${route[EntityType.Lead]}?leadType=${leadType}` : route[EntityType.Lead];
};

export const handleManageTab = async ({
  tabConfiguration,
  activeTabId,
  defaultTabId,
  setNormalizedTabConfig,
  setTabConfig,
  setNotification,
  handleTabAugmentation,
  setActiveTabKey,
  callerSource,
  leadRepName,
  oppRepName,
  entityType,
  eventCode
}: {
  tabConfiguration: ITabConfiguration[];
  activeTabId: string;
  defaultTabId: string;
  callerSource: CallerSource;
  setNormalizedTabConfig;
  setTabConfig;
  setNotification;
  handleTabAugmentation;
  setActiveTabKey;
  leadRepName?: IEntityRepresentationName;
  oppRepName: IEntityRepresentationName;
  entityType: EntityType;
  eventCode?: string;
}): Promise<void> => {
  if (!tabConfiguration?.length) return;

  if (defaultTabId) {
    tabConfiguration = tabConfiguration.map((updatedConfig) => {
      updatedConfig.TabConfiguration.IsDefault = updatedConfig?.Id === defaultTabId;

      return updatedConfig;
    });
  }

  await httpPost({
    path: getRoute(entityType),
    module: Module.Marvin,
    body: tabConfiguration,
    callerSource
  });

  const newConfig = getNormalizedConfig({
    configToBeNormalized: tabConfiguration,
    leadRepName,
    oppRepName,
    entityDetailsType: entityType
  });
  setNormalizedTabConfig(newConfig);
  setActiveTabKey(activeTabId);
  handleTabAugmentation(newConfig, activeTabId);
  setNotification({ type: Type.SUCCESS, message: 'Tab added successfully' });
  setTabConfig(tabConfiguration);
  updateEntityTabConfiguration(entityType, tabConfiguration, eventCode);
};
