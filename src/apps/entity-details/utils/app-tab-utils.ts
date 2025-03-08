import { EntityType, IEntity } from 'common/types';
import { getAccountName, getLeadName } from '.';
import { OPPORTUNITY_NAME_SCHEMA } from '../constants';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { ITabConfig } from 'src/common/component-lib/app-tabs-v2';
import { updateTabConfig } from 'common/utils/helpers/app-tabs';

const getLeadAppTabName = (data?: IEntity): string => {
  return getLeadName(data?.details?.Fields);
};

const getOpportunityAppTabName = (data?: IEntity): string => {
  return (
    data?.details?.Fields?.[OPPORTUNITY_NAME_SCHEMA] ??
    DEFAULT_ENTITY_REP_NAMES.opportunity.SingularName
  );
};

const getAccountAppTabName = (data?: IEntity): string => {
  return getAccountName(data?.details?.Fields);
};

const entityAppTabNameMap: Record<string, (data?: IEntity) => string> = {
  [EntityType.Lead]: getLeadAppTabName,
  [EntityType.Opportunity]: getOpportunityAppTabName,
  [EntityType.Account]: getAccountAppTabName
};

export const updateEntityAppTabConfig = ({
  activeTabId,
  type,
  response,
  error
}: {
  activeTabId: string;
  type: EntityType;
  response?: IEntity;
  error?: boolean;
}): void => {
  const appTabConfig: Partial<ITabConfig> = {};
  if (error) {
    appTabConfig.showErrorState = true;
    appTabConfig.title = 'Error';
  } else {
    appTabConfig.title = entityAppTabNameMap?.[type]?.(response);
  }
  updateTabConfig(activeTabId, appTabConfig);
};
