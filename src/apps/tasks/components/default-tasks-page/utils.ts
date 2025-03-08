import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { EntityType } from 'common/types';
import { taskActions } from '../../constants';
import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import { getLeadType } from 'apps/entity-details/entitydetail.store';

export const getEntityTaskAction = (
  tabId: string,
  coreData: IEntityDetailsCoreData
): IActionWrapperItem => {
  if (coreData?.entityDetailsType === EntityType.Opportunity) {
    const eventCode = coreData.eventCode ? `${coreData.eventCode}` : '';
    return {
      ...taskActions[tabId].ADD_TASK,
      workAreaConfig: { ...taskActions[tabId].ADD_TASK.workAreaConfig, additionalData: eventCode }
    };
  }
  if (coreData?.entityDetailsType === EntityType.Lead) {
    return {
      ...taskActions[tabId].ADD_TASK,
      workAreaConfig: {
        ...taskActions[tabId].ADD_TASK.workAreaConfig,
        additionalData: getLeadType()
      }
    };
  }
  return taskActions[tabId].ADD_TASK;
};
