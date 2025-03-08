import { workAreaIds } from 'common/utils/process';
import { ACTION } from 'apps/entity-details/constants';
import { IActionConfig } from 'apps/entity-details/types';
import { actionKeys } from 'src/apps/smart-views/augment-tab-data/opportunity/constants';
import { handleDeleteActivity } from 'src/apps/smart-views/augment-tab-data/opportunity/helpers';
import { ISvActionConfig, IUserPermission } from 'src/apps/smart-views/smartviews.types';
import { IRowActionConfig } from 'src/apps/smart-views/components/smartview-tab/smartview-tab.types';
import { actionsReducer } from './action-reducer';
import oppDataManager from 'common/utils/entity-data-manager/opportunity';
import { CallerSource } from 'common/utils/rest-client';
import { ANY_OPPORTUNITY } from '../constants';

export const rowActions: IActionConfig[] = [
  {
    key: actionKeys.edit,
    id: ACTION.OpportunityAttributeDetailsEdit,
    title: 'Edit',
    toolTip: 'Edit',
    workAreaConfig: {
      workAreaId: workAreaIds.MANAGE_OPPORTUNITIES.EDIT
    },
    actionHandler: {}
  },
  {
    key: actionKeys.addActivity,
    id: ACTION.OpportunityAddActivity,
    title: 'Add Activity',
    toolTip: 'Add Activity',
    workAreaConfig: {
      workAreaId: workAreaIds.MANAGE_OPPORTUNITIES.ADD_ACTIVITY
    },
    actionHandler: {}
  },
  {
    key: actionKeys.addTask,
    id: ACTION.OpportunityAddTask,
    title: 'Add Task',
    toolTip: 'Add Task',
    workAreaConfig: {
      workAreaId: workAreaIds.MANAGE_OPPORTUNITIES.ADD_TASK
    },
    actionHandler: {}
  },
  {
    key: actionKeys.delete,
    id: ACTION.Delete,
    title: 'Delete',
    toolTip: 'Delete',
    disabled: false,
    actionHandler: {
      getTitle: () => 'Delete Opportunity',
      getDescription: () =>
        'Are you sure you want to delete the selected Opportunity? All the activities, tasks and notes related to this Opportunity will also be deleted. This action cannot be undone.',
      handleDelete: handleDeleteActivity
    }
  }
];

export const getRowActions = async ({
  actionConfig,
  userPermissions,
  opportunityType
}: {
  userPermissions?: IUserPermission;
  actionConfig?: ISvActionConfig;
  opportunityType?: string;
}): Promise<IRowActionConfig> => {
  let canDelete = false;
  if (opportunityType === ANY_OPPORTUNITY) {
    canDelete = true;
  } else {
    const metaData = await oppDataManager.fetchMetaData(CallerSource.SmartViews, opportunityType);
    canDelete = (metaData ?? {})?.CanDelete || false;
  }

  const quickActions = actionsReducer({
    actions: rowActions,
    actionConfig,
    canDelete,
    userPermissions
  });

  return {
    quickActions: quickActions,
    moreActions: []
  };
};
